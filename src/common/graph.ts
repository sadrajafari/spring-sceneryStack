// import * as d3 from 'd3';

// export class GraphComponent {
//   private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
//   private xScale: d3.ScaleLinear<number, number>;
//   private yScale: d3.ScaleLinear<number, number>;
//   private xAxis: d3.Axis<number>;
//   private yAxis: d3.Axis<number>;
//   private line: d3.Selection<SVGPathElement, unknown, HTMLElement, any>;
//   private data: { time: number; value: number }[] = [];
//   private width: number;
//   private height: number;

//   constructor(containerId: string, width: number, height: number, xLabel: string, yLabel: string) {
//     this.width = width;
//     this.height = height;

//     // Create SVG container
//     this.svg = d3.select(`#${containerId}`)
//       .append('svg')
//       .attr('width', width)
//       .attr('height', height);

//     // Set up scales
//     this.xScale = d3.scaleLinear().domain([0, 10]).range([50, width - 50]);
//     this.yScale = d3.scaleLinear().domain([-10, 10]).range([height - 50, 50]);

//     // Set up axes
//     this.xAxis = d3.axisBottom(this.xScale);
//     this.yAxis = d3.axisLeft(this.yScale);

//     // Append x-axis
//     this.svg.append('g')
//       .attr('transform', `translate(0, ${height - 50})`)
//       .attr('class', 'x-axis')
//       .call(this.xAxis);

//     // Append y-axis
//     this.svg.append('g')
//       .attr('transform', 'translate(50, 0)')
//       .attr('class', 'y-axis')
//       .call(this.yAxis);

//     // Add x-axis label
//     this.svg.append('text')
//       .attr('class', 'x-label')
//       .attr('text-anchor', 'middle')
//       .attr('x', width / 2)
//       .attr('y', height - 10)
//       .text(xLabel);

//     // Add y-axis label
//     this.svg.append('text')
//       .attr('class', 'y-label')
//       .attr('text-anchor', 'middle')
//       .attr('transform', 'rotate(-90)')
//       .attr('x', -height / 2)
//       .attr('y', 20)
//       .text(yLabel);

//     // Add line for the graph
//     this.line = this.svg.append('path')
//       .attr('stroke', 'red')
//       .attr('fill', 'none');
//   }

//   public updateGraph(time: number, value: number, xLabel: string, yLabel: string): void {
//     // Add new data point
//     this.data.push({ time, value });

//     // Update x-axis domain if time exceeds the current domain
//     const currentXDomain = this.xScale.domain();
//     if (time > currentXDomain[1]) {
//       this.xScale.domain([currentXDomain[0], time]);
//       this.svg.select<SVGGElement>('.x-axis').call(this.xAxis);
//     }

//     // Update y-axis domain dynamically based on data values
//     const yValues = this.data.map(d => d.value);
//     const minY = Math.min(...yValues);
//     const maxY = Math.max(...yValues);
//     this.yScale.domain([minY, maxY]);
//     this.svg.select<SVGGElement>('.y-axis').call(this.yAxis);

//     // Update line
//     const lineGenerator = d3.line<{ time: number; value: number }>()
//       .x(d => this.xScale(d.time))
//       .y(d => this.yScale(d.value));

//     this.line.attr('d', lineGenerator(this.data));

//     // Update x and y labels dynamically
//     this.svg.select('.x-label').text(xLabel);
//     this.svg.select('.y-label').text(yLabel);
//   }
// }


import * as d3 from 'd3';

export class GraphComponent {
  private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  private xScale: d3.ScaleLinear<number, number>;
  private yScale: d3.ScaleLinear<number, number>;
  private xAxis: d3.Axis<d3.NumberValue>;
  private yAxis: d3.Axis<d3.NumberValue>;
  private referenceLine: d3.Selection<SVGPathElement, unknown, HTMLElement, any>;
  private testLine: d3.Selection<SVGPathElement, unknown, HTMLElement, any>;
  private referenceData: { time: number; value: number }[] = [];
  private testData: { time: number; value: number }[] = [];
  private width: number;
  private height: number;

  constructor(containerId: string, width: number, height: number, xLabel: string, yLabel: string) {
    this.width = width;
    this.height = height;

    // Create SVG container
    this.svg = d3.select(`#${containerId}`)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Set up scales
    this.xScale = d3.scaleLinear().domain([0, 10]).range([50, width - 50]);
    this.yScale = d3.scaleLinear().domain([-10, 10]).range([height - 50, 50]);

    // Set up axes
    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);

    // Append x-axis
    this.svg.append('g')
      .attr('transform', `translate(0, ${height - 50})`)
      .attr('class', 'x-axis')
      .call(this.xAxis);

    // Append y-axis
    this.svg.append('g')
      .attr('transform', 'translate(50, 0)')
      .attr('class', 'y-axis')
      .call(this.yAxis);

    // Add x-axis label
    this.svg.append('text')
      .attr('class', 'x-label')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .text(xLabel);

    // Add y-axis label
    this.svg.append('text')
      .attr('class', 'y-label')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 12)
      .text(yLabel);

    // Add reference line (red)
    this.referenceLine = this.svg.append('path')
      .attr('stroke', 'red')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    // Add test line (blue)
    this.testLine = this.svg.append('path')
      .attr('stroke', 'blue')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
  }

  public updateGraph(
    time: number,
    referenceValue: number,
    testValue: number | null, // Test value can be null if it doesn't exist
    xLabel: string,
    yLabel: string
  ): void {
    // Add new data point to reference data
    this.referenceData.push({ time, value: referenceValue });

    // Add new data point to test data if testValue exists
    if (testValue !== null) {
      this.testData.push({ time, value: testValue });
    }

    // Update x-axis domain if time exceeds the current domain
    const currentXDomain = this.xScale.domain();
    if (time > currentXDomain[1]) {
      this.xScale.domain([currentXDomain[0], time]);
      this.svg.select<SVGGElement>('.x-axis').call(this.xAxis);
    }

    // Update y-axis domain dynamically based on both datasets
    const allValues = [
      ...this.referenceData.map(d => d.value),
      ...this.testData.map(d => d.value)
    ];
    const minY = Math.min(...allValues);
    const maxY = Math.max(...allValues);
    this.yScale.domain([minY, maxY]);
    this.svg.select<SVGGElement>('.y-axis').call(this.yAxis);

    // Update reference line
    const lineGenerator = d3.line<{ time: number; value: number }>()
      .x(d => this.xScale(d.time))
      .y(d => this.yScale(d.value));

    this.referenceLine.attr('d', lineGenerator(this.referenceData));

    // Update test line if test data exists
    if (this.testData.length > 0) {
      this.testLine.attr('d', lineGenerator(this.testData));
    }

    // Update x and y labels dynamically
    this.svg.select('.x-label').text(xLabel);
    this.svg.select('.y-label').text(yLabel);
  }
  public resetGraph(): void {
    // Clear the data arrays
    this.referenceData = [];
    this.testData = [];

    // Clear the lines from the SVG
    this.referenceLine.attr('d', null);
    this.testLine.attr('d', null);

    // Optionally reset the axes to their initial domains
    this.xScale.domain([0, 10]);
    this.yScale.domain([-10, 10]);
    this.svg.select<SVGGElement>('.x-axis').call(this.xAxis);
    this.svg.select<SVGGElement>('.y-axis').call(this.yAxis);
  }
}