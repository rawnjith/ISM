import * as d3 from 'd3';
import type { Factor } from '../types';

export function createMICMACPlot(
  svgElement: SVGSVGElement,
  factors: Factor[],
  drivingPower: { [key: string]: number },
  dependencePower: { [key: string]: number }
) {
  // Clear existing content
  d3.select(svgElement).selectAll('*').remove();

  // Set up dimensions
  const width = svgElement.clientWidth;
  const height = 500;
  const margin = { top: 40, right: 40, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Create scales
  const maxPower = Math.max(
    ...Object.values(drivingPower),
    ...Object.values(dependencePower)
  );

  const xScale = d3.scaleLinear()
    .domain([0, maxPower])
    .range([0, innerWidth])
    .nice();

  const yScale = d3.scaleLinear()
    .domain([0, maxPower])
    .range([innerHeight, 0])
    .nice();

  // Create SVG container
  const svg = d3.select(svgElement)
    .attr('viewBox', [0, 0, width, height]);

  // Create main group
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Add quadrant lines
  const midPoint = maxPower / 2;
  g.append('line')
    .attr('x1', xScale(0))
    .attr('x2', xScale(maxPower))
    .attr('y1', yScale(midPoint))
    .attr('y2', yScale(midPoint))
    .attr('stroke', '#ddd')
    .attr('stroke-dasharray', '4');

  g.append('line')
    .attr('x1', xScale(midPoint))
    .attr('x2', xScale(midPoint))
    .attr('y1', yScale(0))
    .attr('y2', yScale(maxPower))
    .attr('stroke', '#ddd')
    .attr('stroke-dasharray', '4');

  // Add quadrant labels
  const quadrants = [
    { x: xScale(maxPower / 4), y: yScale(maxPower * 3/4), text: 'Autonomous' },
    { x: xScale(maxPower * 3/4), y: yScale(maxPower * 3/4), text: 'Linkage' },
    { x: xScale(maxPower / 4), y: yScale(maxPower / 4), text: 'Dependent' },
    { x: xScale(maxPower * 3/4), y: yScale(maxPower / 4), text: 'Independent' }
  ];

  g.selectAll('.quadrant-label')
    .data(quadrants)
    .join('text')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('text-anchor', 'middle')
    .attr('fill', '#666')
    .text(d => d.text);

  // Add axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis);

  g.append('g')
    .call(yAxis);

  // Add axis labels
  g.append('text')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + margin.bottom - 10)
    .attr('text-anchor', 'middle')
    .text('Dependence Power');

  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', -margin.left + 20)
    .attr('text-anchor', 'middle')
    .text('Driving Power');

  // Plot points
  const points = factors.map(factor => ({
    id: factor.id,
    name: factor.name,
    x: dependencePower[factor.id],
    y: drivingPower[factor.id]
  }));

  g.selectAll('circle')
    .data(points)
    .join('circle')
    .attr('cx', d => xScale(d.x))
    .attr('cy', d => yScale(d.y))
    .attr('r', 6)
    .attr('fill', '#2563eb')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2);

  // Add tooltips
  g.selectAll('.point-label')
    .data(points)
    .join('text')
    .attr('x', d => xScale(d.x))
    .attr('y', d => yScale(d.y) - 10)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .text(d => d.name);
}