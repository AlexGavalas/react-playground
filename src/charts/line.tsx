import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

import { useElementSize } from '../hooks/use-element-size';

type Data = {
    label: number;
    value: number;
};

const MARGIN = {
    top: 10,
    right: 1,
    bottom: 10,
    left: 0,
};

export const LineChart = () => {
    const container = useRef<HTMLDivElement>(null);
    const wrapper = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [data, setData] = useState<Data[]>([]);
    const [title, setTitle] = useState('A title');

    const { height = 0, width = 0 } = useElementSize(wrapper);

    const generateData = () => {
        const chartData = [...Array(20)].map((_, i) => ({
            label: i,
            value: Math.floor(Math.random() * i * 3) * 10,
        }));

        setData(chartData);
    };

    const drawChart = () => {
        const yMaxVal = d3.max(data, (d) => d.value) ?? 0;
        const xMinVal = d3.min(data, (d) => d.label) ?? 0;
        const xMaxVal = d3.max(data, (d) => d.label) ?? 0;

        if (!titleRef.current) return;

        // START Find yaxis labels width
        let maxw = 0;

        d3.select(container.current)
            .append('svg')
            .call(d3.axisLeft(d3.scaleLinear().domain([0, yMaxVal])))
            .each(function () {
                maxw = this.getBBox().width;
            })
            .remove();
        // END Find yaxis labels width

        const INNER_WIDTH = width - MARGIN.left - MARGIN.right - maxw;

        const INNER_HEIGHT =
            height - MARGIN.top - MARGIN.bottom - titleRef.current.offsetHeight;

        const svg = d3
            .select(container.current)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .append('g')
            .attr(
                'transform',
                `translate(${MARGIN.left + maxw}, ${MARGIN.top})`,
            );

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
            .call(
                d3.axisBottom(xScale).tickSize(-INNER_HEIGHT).tickFormat(null),
            )
            // Remove these labels
            .selectAll('text')
            .remove();

        // y-axis grid
        svg.append('g')
            .attr('class', 'grid')
            .attr('opacity', 0.2)
            .call(d3.axisLeft(yScale).tickSize(-INNER_WIDTH))
            // Remove these labels
            .selectAll('text')
            .remove();

        // x-axis
        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${INNER_HEIGHT})`)
            .call(d3.axisBottom(xScale));

        // y-axis
        svg.append('g')
            .attr('class', 'y-axis')
            .attr('id', 'yaxis')
            .call(d3.axisLeft(yScale));

        // line
        const line = d3
            .line<Data>()
            .x((d) => xScale(d.label))
            .y((d) => yScale(d.value))
            .curve(d3.curveMonotoneX);

        // mount line to the chart
        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'aqua')
            .attr('stroke-width', 3)
            .attr('class', 'line')
            .attr('d', line);

        // Tooltip
        const Tooltip = d3
            .select(container.current)
            .append('div')
            .style('opacity', 0)
            .attr('class', 'tooltip')
            .style('background-color', 'white')
            .style('border', 'solid')
            .style('border-width', '2px')
            .style('border-radius', '5px')
            .style('padding', '5px');

        const mouseover = function () {
            Tooltip.style('opacity', 1);
        };

        const mousemove = function (d: MouseEvent) {
            const val = xScale.invert(d.x);

            const idx = d3.bisector((d: Data) => d.label).left(data, val);

            const v = data[idx - 1];

            Tooltip.html(
                'The exact value of<br>this cell is: ' +
                    v.value +
                    ' ' +
                    v.label,
            )
                .style('position', 'absolute')
                .style('left', `${d.x}px`)
                .style('top', `${d.y}px`);
        };

        const mouseleave = function () {
            Tooltip.style('opacity', 0);
        };

        d3.select(container.current)
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseleave', mouseleave);
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
    }, [data, width, height, title]);

    return (
        <div
            style={{
                height: '100%',
                display: 'grid',
                gridTemplateRows: 'auto auto 1fr',
            }}
        >
            <h4
                style={{
                    wordBreak: 'break-all',
                    width: '300px',
                }}
                ref={titleRef}
            >
                {title}
            </h4>
            <button
                onClick={() =>
                    setTitle(
                        'A very long title to show responsive height'.repeat(
                            10,
                        ),
                    )
                }
            >
                Change title
            </button>
            <div style={{ height: '100%' }} ref={wrapper}>
                <div style={{ height: '100%' }} ref={container} />
            </div>
        </div>
    );
};
