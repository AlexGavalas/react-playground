import { useMemo, useRef } from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { GradientTealBlue } from '@visx/gradient';
import { scaleBand, scaleLinear } from '@visx/scale';

import letterFrequency, {
    LetterFrequency,
} from '@visx/mock-data/lib/mocks/letterFrequency';

import { useElementSize } from '../hooks/use-element-size';

const data = letterFrequency.slice(5);
const verticalMargin = 120;

const getLetter = (d: LetterFrequency) => d.letter;
const getLetterFrequency = (d: LetterFrequency) => Number(d.frequency) * 100;

export const BarChart = () => {
    const wrapper = useRef(null);
    const { width = 0, height = 0 } = useElementSize(wrapper);

    // Bounds
    const xMax = width;
    const yMax = height - verticalMargin;

    // Scales
    const xScale = useMemo(
        () =>
            scaleBand<string>({
                range: [0, xMax],
                round: true,
                domain: data.map(getLetter),
                padding: 0.4,
            }),
        [xMax],
    );

    const yScale = useMemo(
        () =>
            scaleLinear<number>({
                range: [yMax, 0],
                round: true,
                domain: [0, Math.max(...data.map(getLetterFrequency))],
            }),
        [yMax],
    );

    // Overflow hidden so the container can shrink, else it just overflows
    return (
        <div style={{ height: '100%', overflow: 'hidden' }} ref={wrapper}>
            {width !== 0 && (
                <svg width={width} height={height}>
                    <GradientTealBlue id="teal" />
                    <rect
                        width={width}
                        height={height}
                        fill="url(#teal)"
                        rx={14}
                    />
                    <Group top={verticalMargin / 2}>
                        {data.map((d) => {
                            const letter = getLetter(d);
                            const barWidth = xScale.bandwidth();

                            const barHeight =
                                yMax - (yScale(getLetterFrequency(d)) ?? 0);

                            const barX = xScale(letter);
                            const barY = yMax - barHeight;

                            return (
                                <Bar
                                    key={`bar-${letter}`}
                                    x={barX}
                                    y={barY}
                                    width={barWidth}
                                    height={barHeight}
                                    fill="rgba(23, 233, 217, .5)"
                                />
                            );
                        })}
                    </Group>
                </svg>
            )}
        </div>
    );
};
