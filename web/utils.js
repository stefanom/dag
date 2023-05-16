/**
 * Gets the median of an array of numeric values.
 * 
 * @param {array[numbers]} values 
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
function getDagEdges(text) {

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
            result.metadata.value = effort;
        }

        if (effort && uncertainty) {
            result.metadata.uncertainty = parseFloat(uncertainty);
            result.metadata.value += result.metadata.value * result.metadata.uncertainty;
        }

        results.push(result);
    }

    // Get the median of the local values from the results that have it.
    let values = results.filter(obj => obj.metadata.hasOwnProperty('value')).map(obj => obj.metadata.value);
    let medianValue = median(values);

    // Update objects that do not have it with the median.
    results.forEach(obj => {
        if (!obj.metadata.hasOwnProperty('value')) {
            obj.metadata.value = medianValue;
        }
    });

    return results;
}

/**
 * Create a Graphlib graph from an array of objects of the form:
 * 
 * {
 *  'source': <str>,
 *  'target': <str>,
 *  'effort': <int>,
 *  'uncertainty': <float>,
 *  'localValue':
 * }
 * 
 * @param {array of objects} edges 
 * @returns 
 */
function createGraph(links) {
    console.log(JSON.stringify(links, null, 2));

    var graph = new graphlib.Graph();
    var metadata = {};
    links.forEach(link => {
        graph.setEdge(link.source, link.target);
        metadata[link.source + link.target] = link.metadata;
    });

    let nodes = {};
    links.forEach(link => {
        link.source = nodes[link.source] || (nodes[link.source] = { name: link.source });
        link.target = nodes[link.target] || (nodes[link.target] = { name: link.target });
        link.value = link.metadata.value;
    });

    console.log(graph);
    console.log(graph.nodes());
    console.log(graph.edges());
    console.log(metadata);
    console.log(links);

    return {
         nodes: Object.values(nodes),
         links: links
    };
}
