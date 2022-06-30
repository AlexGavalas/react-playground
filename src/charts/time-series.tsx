import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CSV_URL =
    'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv';

export const TimeSeries = () => {
    const container = useRef(null);
    const wrapper = useRef(null);
    const [data, setData] = useState([]);

    const generateData = async () => {
        const csvData = [];

        const formatTime = d3.timeParse('%Y-%m-%d');

        await d3.csv(CSV_URL, {}, (row) => {
            csvData.push({
                date: formatTime(row.date),
                value: parseFloat(row.value),
            });
        });

        setData(csvData);
    };

    const drawChart = () => {
        const margin = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 40,
        };

        const yMaxVal = d3.max(data, (d) => +d.value);

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
            .scaleTime()
            .domain(d3.extent(data, (d) => d.date))
            .range([0, INNER_WIDTH]);

        // x-axis grid
        svg.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0, ${INNER_HEIGHT})`)
            .attr('opacity', 0.2)
            .call(d3.axisBottom(xScale).tickSize(-INNER_HEIGHT).tickFormat(''));

        // x-axis
        svg.append('g')
            .attr('transform', `translate(0, ${INNER_HEIGHT})`)
            .call(d3.axisBottom(xScale));

        // y-axis scale
        const yScale = d3
            .scaleLinear()
            .domain([0, yMaxVal])
            .range([INNER_HEIGHT, 0]);

        // y-axis grid
        svg.append('g')
            .attr('class', 'grid')
            .attr('opacity', 0.2)
            .call(d3.axisLeft(yScale).tickSize(-INNER_WIDTH).tickFormat(''));

        // y-axis
        svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(yScale));

        // line
        const line = d3
            .line()
            .x((d) => xScale(d.date))
            .y((d) => yScale(d.value))
            .curve(d3.curveMonotoneX);

        // mount line to the chart
        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#d4c')
            .attr('stroke-width', 1.5)
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
            <h4>Time series with D3</h4>
            <div style={{ height: '100%' }} ref={wrapper}>
                <div style={{ height: '100%' }} ref={container} />
            </div>
        </div>
    );
};
