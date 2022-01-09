import { useCallback, useRef } from 'react';
import * as d3 from 'd3';
import * as allCurves from '@visx/curve';
import { Group } from '@visx/group';
import { LinePath, Bar } from '@visx/shape';
import { MarkerCircle } from '@visx/marker';
import { Axis, AxisLeft, Orientation } from '@visx/axis';
import { scaleTime, scaleLinear, scaleUtc } from '@visx/scale';

import { withTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';

import generateDateValue, {
    DateValue,
} from '@visx/mock-data/lib/generators/genDateValue';

import { useElementSize } from '../hooks/use-element-size';

const series = generateDateValue(25, 72).sort(
    (a: DateValue, b: DateValue) => a.date.getTime() - b.date.getTime(),
);

// data accessors
const getX = (d: DateValue) => d.date;
const getY = (d: DateValue) => d.value;

// scales
const xScale = scaleTime<number>({
    domain: d3.extent(series, getX) as [Date, Date],
});

const yScale = scaleLinear<number>({
    domain: [0, d3.max(series, getY) as number],
});

const getMinMax = (series: DateValue[]) => {
    return [d3.min(series, getX) as Date, d3.max(series, getX) as Date];
};

const tooltipStyles = {
    ...defaultStyles,
    background: '#000',
    border: '1px solid white',
    color: 'white',
};

export const LinesChart = withTooltip(
    ({ showTooltip, tooltipData, tooltipLeft, tooltipTop, hideTooltip }) => {
        const wrapper = useRef(null);
        const { width = 0, height = 0 } = useElementSize(wrapper);

        const svgHeight = height;
        const axisHeight = 30;
        const yAxisWidth = 50;
        const verticalSpace = 0;
        const horizontalSpace = 10;
        const margin = 20;

        const xRange = [
            yAxisWidth + horizontalSpace + margin,
            width - 2 * horizontalSpace - margin,
        ];

        xScale.range(xRange);
        yScale.range([height - axisHeight - verticalSpace, axisHeight]);

        const xAxis = {
            scale: scaleUtc({
                domain: getMinMax(series),
                range: xRange,
            }),
            values: series.map((d) => d.date),
        };

        // tooltip handler
        const handleTooltip = useCallback(
            (
                event:
                    | React.TouchEvent<SVGRectElement>
                    | React.MouseEvent<SVGRectElement>,
            ) => {
                const { x, y } = localPoint(event) || { x: 0, y: 0 };

                showTooltip({
                    tooltipData: { x, y },
                    tooltipLeft: x,
                    tooltipTop: y,
                });
            },
            [showTooltip],
        );

        // Overflow hidden so the container can shrink, else it just overflows
        return (
            <div style={{ height: '100%', overflow: 'hidden' }} ref={wrapper}>
                {width !== 0 && (
                    <svg width={width} height={svgHeight}>
                        <rect
                            width={width}
                            height={svgHeight}
                            fill="#efefef"
                            rx={14}
                        />
                        <MarkerCircle id="marker-circle" fill="#333" size={3} />
                        <Group>
                            <LinePath<DateValue>
                                curve={allCurves.curveNatural}
                                data={series}
                                x={(d) => xScale(getX(d)) ?? 0}
                                y={(d) => yScale(getY(d)) ?? 0}
                                stroke="#333"
                                shapeRendering="geometricPrecision"
                                markerMid="url(#marker-circle)"
                            />
                            <Axis
                                orientation={Orientation.bottom}
                                top={height - axisHeight}
                                scale={xAxis.scale}
                                tickValues={xAxis.values}
                                tickFormat={(v) => {
                                    return d3.timeFormat('%b %d')(v as Date);
                                }}
                            />
                            <AxisLeft scale={yScale} left={yAxisWidth} />
                            <Bar
                                x={margin}
                                y={margin}
                                width={width - margin}
                                height={height - margin}
                                fill="transparent"
                                rx={14}
                                onTouchStart={handleTooltip}
                                onTouchMove={handleTooltip}
                                onMouseMove={handleTooltip}
                                onMouseLeave={() => hideTooltip()}
                            />
                            {tooltipData && (
                                <g>
                                    <circle
                                        cx={tooltipLeft}
                                        cy={tooltipTop}
                                        r={4}
                                        fill="black"
                                        fillOpacity={0.1}
                                        stroke="black"
                                        strokeOpacity={0.1}
                                        strokeWidth={2}
                                        pointerEvents="none"
                                    />
                                    <circle
                                        cx={tooltipLeft}
                                        cy={tooltipTop}
                                        r={4}
                                        fill="#000"
                                        stroke="white"
                                        strokeWidth={2}
                                        pointerEvents="none"
                                    />
                                </g>
                            )}
                        </Group>
                    </svg>
                )}
                {tooltipData && (
                    <div>
                        <TooltipWithBounds
                            top={tooltipTop}
                            left={tooltipLeft}
                            style={tooltipStyles}
                        >
                            I am a tooltip
                        </TooltipWithBounds>
                    </div>
                )}
            </div>
        );
    },
);
