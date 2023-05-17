import * as d3 from 'd3';
//import * as d3Sankey from 'd3-sankey-circular';
import * as d3Sankey from 'd3-sankey';
import * as marked from 'marked';
import { createGraph, getDagEdges } from './utils';

import 'bulma/bulma.sass';
import './dag.css';

const debug = true;
const width = window.innerWidth;
const height = 800;
const padding = 5;
const nodeWidth = 10;
const nodePadding = 10;
const nodeLabelPadding = 6;
const alignment = d3Sankey.sankeyRight;

function log(obj) {
    if (debug) {
        console.log(JSON.stringify(obj, null, 2));
    }
}

marked.use({
    async: false,
    pedantic: false,
    mangle: false,
    headerIds: false,
    gfm: true,
});

const sankeyPlot = d3.select("#chart")
    .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

const sankey = d3Sankey.sankey()
    .nodeId(d => d.name)
    .nodeAlign(alignment)
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .extent([[padding, padding], [width - padding, height - padding]]);

function updateChart() {
    const inputText = document.getElementById('inputText').value;

    // First make sure it's valid markdown and render it
    document.getElementById('markdown').innerHTML = marked.parse(inputText);

    // Then, let's extract the dag from it
    const links = getDagEdges(inputText);
    const graph = createGraph(links);

    sankey(graph);

    //console.log(graph);

    sankeyPlot.selectAll('*').remove();

    sankeyPlot.append("g")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.2)
        .selectAll("path")
        .data(graph.links)
        .enter()
        .append("path")
            .attr("d", d3Sankey.sankeyLinkHorizontal())
            .style("stroke-width", d => d.width)
            .style("stroke", d => d.circular ? "red" : "black");

    const node = sankeyPlot.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
            .attr("class", "node")
            .attr("transform", d => "translate(" + d.x0 + "," + d.y0 + ")");

    node.append("rect")
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .style("fill", d => d.color = d3.scaleOrdinal(d3.schemeCategory10)(d.name.replace(/ .*/, "")))
        .style("stroke", d => d3.rgb(d.color).darker(2));

    node.append("text")
        .attr("class", "label")
        .text(d => d.name + " [" + d.metadata.mass + "]")
        .attr("x", d => d.x0 < width / 2 ? nodeWidth + nodeLabelPadding : (d.x1 - d.x0 - nodeWidth - nodeLabelPadding))
        .attr("y", d => (d.y1 - d.y0) / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end");
}

document.getElementById('inputText').addEventListener('input', updateChart);
updateChart();
