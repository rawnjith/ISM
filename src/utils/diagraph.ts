import * as d3 from 'd3';
import type { Factor, PartitionLevel } from '../types';

interface Node {
  id: string;
  name: string;
  level: number;
}

interface Link {
  source: string;
  target: string;
}

export function createDiagraph(
  svgElement: SVGSVGElement,
  factors: Factor[],
  levels: PartitionLevel[],
  reachabilityMatrix: { [key: string]: { [key: string]: number } }
) {
  // Clear existing content
  d3.select(svgElement).selectAll('*').remove();

  // Reverse the level numbering (first iteration = top level)
  const maxLevel = Math.max(...levels.map(l => l.level));
  
  // Create nodes array with reversed levels
  const nodes: Node[] = factors.map(factor => {
    const originalLevel = levels.find(l => l.factors.includes(factor.id))?.level || 0;
    return {
      id: factor.id,
      name: factor.name,
      level: maxLevel - originalLevel + 1 // Reverse the level
    };
  });

  // Create links array
  const links: Link[] = [];
  Object.keys(reachabilityMatrix).forEach(source => {
    Object.entries(reachabilityMatrix[source]).forEach(([target, value]) => {
      if (value === 1 && source !== target) {
        // Only create direct links between adjacent levels
        const sourceNode = nodes.find(n => n.id === source);
        const targetNode = nodes.find(n => n.id === target);
        if (sourceNode && targetNode && Math.abs(sourceNode.level - targetNode.level) === 1) {
          links.push({ source, target });
        }
      }
    });
  });

  // Set up SVG dimensions
  const width = svgElement.clientWidth;
  const height = 500;
  const levelHeight = height / (maxLevel + 1);
  const padding = 40;

  // Create SVG container
  const svg = d3.select(svgElement)
    .attr('viewBox', [0, 0, width, height]);

  // Create arrow marker
  svg.append('defs').append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '-10 -10 20 20')
    .attr('refX', 20)
    .attr('refY', 0)
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M-6.75,-6.75 L 0,0 L -6.75,6.75')
    .attr('fill', '#888');

  // Group nodes by level
  const nodesByLevel = d3.group(nodes, d => d.level);
  
  // Calculate x positions for each level
  nodesByLevel.forEach((levelNodes, level) => {
    const levelWidth = width - 2 * padding;
    const nodeSpacing = levelWidth / (levelNodes.length + 1);
    levelNodes.forEach((node, i) => {
      node.x = padding + (i + 1) * nodeSpacing;
      node.y = padding + (level - 1) * levelHeight;
    });
  });

  // Create links
  const link = svg.append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', '#888')
    .attr('stroke-width', 1.5)
    .attr('marker-end', 'url(#arrowhead)')
    .attr('x1', d => nodes.find(n => n.id === d.source)?.x)
    .attr('y1', d => nodes.find(n => n.id === d.source)?.y)
    .attr('x2', d => nodes.find(n => n.id === d.target)?.x)
    .attr('y2', d => nodes.find(n => n.id === d.target)?.y);

  // Create nodes
  const node = svg.append('g')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .attr('transform', d => `translate(${d.x},${d.y})`);

  // Add circles to nodes
  node.append('circle')
    .attr('r', 20)
    .attr('fill', '#fff')
    .attr('stroke', '#2563eb')
    .attr('stroke-width', 2);

  // Add labels to nodes
  node.append('text')
    .text(d => d.name)
    .attr('text-anchor', 'middle')
    .attr('dy', '0.3em')
    .attr('font-size', '12px');

  // Add level labels
  svg.append('g')
    .selectAll('text')
    .data(Array.from(nodesByLevel.keys()))
    .join('text')
    .attr('x', 10)
    .attr('y', d => padding + (d - 1) * levelHeight)
    .attr('dy', '-1em')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .text(d => `Level ${maxLevel - d + 1}`);
}