import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const JSON_URL = 'https://api.openbrewerydb.org/breweries';

export const Histogram = () => {
    const container = useRef(null);
    const wrapper = useRef(null);
    const [data, setData] = useState([]);

    const generateData = async () => {
        const response = await fetch(JSON_URL);
        const result = await response.json();

        const stateFreq = result.reduce((acc, val) => {
            if (!val.state) return acc;

            if (acc[val.state]) {
                acc[val.state]++;
            } else {
                acc[val.state] = 1;
            }

            return acc;
        }, {});

        const jsonData = Object.entries(stateFreq)
            .map(([state, frequency]) => ({ state, frequency }))
            .sort((a, b) => b.frequency - a.frequency);

        setData(jsonData);
    };

    const margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 40,
    };

    const drawChart = () => {
        const yMaxVal = d3.max(data, (d) => d.frequency);

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
            .attr('transform', `translate(0, -${margin.top - 10})`);

        // x-axis scale
        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d.state))
            .rangeRound([margin.left, INNER_WIDTH - margin.right])
            .padding(0.1);

        // x-axis
        const xAxis = svg
            .append('g')
            .attr('transform', `translate(0, ${INNER_HEIGHT - margin.bottom})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-0.8em')
            .attr('dy', '0.15em')
            .attr('font-size', '120%')
            .attr('transform', 'rotate(-65)');

        // y-axis scale
        const yScale = d3
            .scaleLinear()
            .domain([0, yMaxVal])
            .range([INNER_HEIGHT - margin.bottom, margin.top]);

        // y-axis
        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale));

        const barColors = d3
            .scaleLinear()
            .domain([0, yMaxVal])
            .range(['blue', 'red']);

        // append the bars
        svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (d) => xScale(d.state))
            .attr('y', (d) => yScale(d.frequency))
            .attr('width', () => xScale.bandwidth())
            .attr('height', (d) => yScale(0) - yScale(d.frequency))
            .attr('fill', (d) => barColors(d.frequency));

        return {
            xScale,
            svg,
            xAxis,
        };
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
            <h4>Histogram with d3</h4>
            <div style={{ height: '100%' }} ref={wrapper}>
                <div ref={container} style={{ height: '100%' }} />
            </div>
        </div>
    );
};
