import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

export const LineChart = () => {
    const container = useRef(null);
    const wrapper = useRef(null);
    const [data, setData] = useState([]);

    const generateData = () => {
        const chartData = [];

        for (let i = 0; i < 20; i++) {
            const value = Math.floor(Math.random() * i * 3);

            chartData.push({
                label: i,
                value,
            });
        }

        setData(chartData);
    };

    const drawChart = () => {
        const margin = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
        };

        const yMaxVal = d3.max(data, (d) => d.value);
        const xMinVal = d3.min(data, (d) => d.label);
        const xMaxVal = d3.max(data, (d) => d.label);

        const { offsetWidth: WIDTH, offsetHeight: HEIGHT } = wrapper.current;

        const INNER_WIDTH = WIDTH - margin.left - margin.right;
        const INNER_HEIGHT = HEIGHT - margin.top - margin.bottom;

        const svg = d3
            .select(container.current)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('preserveAspectRatio', 'xMinYMin')
            .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // x-axis scale
        const xScale = d3
            .scaleLinear()
            .domain([xMinVal, xMaxVal])
            .range([0, INNER_WIDTH]);

        // y-axis scale
        const yScale = d3
            .scaleLinear()
            .domain([0, yMaxVal])
            .range([INNER_HEIGHT, 0]);

        // x-axis grid
        svg.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0, ${INNER_HEIGHT})`)
            .attr('opacity', 0.2)
            .call(d3.axisBottom(xScale).tickSize(-INNER_HEIGHT).tickFormat(''));

        // y-axis grid
        svg.append('g')
            .attr('class', 'grid')
            .attr('opacity', 0.2)
            .call(d3.axisLeft(yScale).tickSize(-INNER_WIDTH).tickFormat(''));

        // x-axis
        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${INNER_HEIGHT})`)
            .call(d3.axisBottom().scale(xScale));

        // y-axis
        svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(yScale));

        // line
        const line = d3
            .line()
            .x((d) => xScale(d.label))
            .y((d) => yScale(d.value))
            .curve(d3.curveMonotoneX);

        // mount line to the chart
        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#d33')
            .attr('stroke-width', 3)
            .attr('class', 'line')
            .attr('d', line);
    };

    useEffect(() => {
        if (!data.length) {
            generateData();
        } else {
            drawChart();
        }

        return () => {
            if (container.current) {
                container.current.innerHTML = '';
            }
        };
    }, [data]);

    return (
        <div style={{ height: '100%' }}>
            <h4>Line chart with d3</h4>
            <div style={{ height: '100%' }} ref={wrapper}>
                <div style={{ height: '100%' }} ref={container} />
            </div>
        </div>
    );
};
