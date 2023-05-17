import { now } from 'd3';
import * as graphology from 'graphology';
import { hasCycle, topologicalSort } from 'graphology-dag';

/**
 * Gets the median of an array of numeric values.
 * 
 * @param {array[number]} values 
 * @returns the median 
 */
function median(values) {
    values.sort((a, b) => a - b);
    let half = Math.floor(values.length / 2);
    if (values.length % 2) {
        return values[half];
    } else {
        return (values[half - 1] + values[half]) / 2.0;
    }
}

/**
 * Parse text and extract Dag edges from strings of the form
 * 
 * * A > B [xx|yy.zz]
 * 
 * The metadata section [] is optional. If present, 'xx' represents the 
 * task effort (as an integer). 'yy.zz' is an optional amount of 
 * 'uncertainty' which is a float and is used to model the uncertainty 
 * of evaluating the effort it would take to complete a task.
 * 
 * These are examples of valid strings:
 * 
 * * A > B
 * * A > B [23]
 * * A > B [23|1]
 * * A > B [23|1.2]
 * 
 * Strings that don't match any of the above templates are ignored.
 * 
 * @param {str} text 
 * @returns 
 */
export function getDagEdges(text) {

    let lines = text.split('\n');
    let results = [];

    for (let line of lines) {
        // Ignore all the lines that don't start with '* '
        if (!line.startsWith('* ')) continue;

        // Remove '* ' and trim the whitespace
        line = line.slice(2).trim();

        // Split the line between the source and the target
        let parts = line.split(' > ');

        // Ignore the lines that don't have exactly 2 parts
        if (parts.length != 2) continue;

        let target = parts[0].trim();
        let source = parts[1].trim();

        let effort = null;
        let uncertainty = null;

        if (source.includes('[') && source.includes(']')) {
            if (source.includes('|')) {
                let matches = source.match(/(.*)\s+\[(\d+)\|(\d+(\.\d+)?)\]/);
                if (!matches) continue;
                source = matches[1];
                effort = parseInt(matches[2]);
                uncertainty = parseFloat(matches[3]);
            } else {
                let matches = source.match(/(.*)\s\[(\d+)\]/);
                if (!matches) continue;
                source = matches[1];
                effort = parseInt(matches[2]);
            }
        }

        const result = {
            source: source,
            target: target,
            metadata: {},
        };

        if (effort) {
            result.metadata.effort = parseInt(effort, 10);
        }

        if (uncertainty) {
            result.metadata.uncertainty = parseFloat(uncertainty);
        }

        results.push(result);
    }

    return results;
}

/**
 * Create a graph from an array of objects of the form:
 * 
 * {
 *   'source': <str>,
 *   'target': <str>,
 *   'metadata': {
 *     'effort': <int>,
 *     'uncertainty': <float>,
 *   }
 * }
 * 
 * @param {array[object]} links 
 * @returns 
 */
export function createGraph(links) {
    let graph = new graphology.Graph();

    // Create the graph from links.
    let masses = [];
    links.forEach(link => {
        let source = link.source;
        let target = link.target;
        let metadata = link.metadata;

        if (metadata.hasOwnProperty('effort')) {
            metadata.ownMass = metadata.effort;
            if (metadata.hasOwnProperty('uncertainty')) {
                metadata.ownMass += metadata.effort * metadata.uncertainty;
            } else {
                metadata.uncertainty = 0;
            }
            masses.push(metadata.ownMass);
        }

        if (!graph.hasNode(source)) {
            graph.addNode(source, metadata);
        }
        if (!graph.hasNode(target)) {
            graph.addNode(target);
        }
        graph.addEdge(source, target);
    });

    // Bail if the graph has cycles.
    if (hasCycle(graph)) {
        throw new Error("The graph has cycles.");
    }
    
    // It is expected that some of the nodes will not have any metadata
    // associated to them so at the very least we need to find an effort
    // which we will default to be the the median of the mass of all the
    // other tasks that have it.
    let medianMass = median(masses) || 1;

    // Update objects that do not have mass with the median mass of all the tasks.
    graph.forEachNode((node, attributes) => {
        if (!attributes.ownMass) {
            attributes.ownMass = medianMass;
        }
    });

    // Iterate over nodes sorted topologically
    topologicalSort(graph).forEach(node => {
        let downstreamMass = 0;
        graph.forEachInNeighbor(node, child => {
            downstreamMass += graph.getNodeAttribute(child, 'mass');
        });
        graph.setNodeAttribute(node, 'downstreamMass', downstreamMass);
        let ownMass = graph.getNodeAttribute(node, 'ownMass');
        graph.setNodeAttribute(node, 'mass', ownMass + downstreamMass);
    })

    let nodes = {};
    let edges = [];
    links.forEach(link => {
        edges.push({
            source: nodes[link.source] || (nodes[link.source] = { name: link.source }),
            target: nodes[link.target] || (nodes[link.target] = { name: link.target }),
            value: graph.getNodeAttributes(link.source).mass,
        })
    });

    nodes = Object.values(nodes);
    nodes.forEach(node => {
        node.metadata = graph.getNodeAttributes(node.name);
    });

    return {
         nodes: nodes,
         links: edges
    };
}
