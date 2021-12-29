const WORKLET = 'houdini-snow';

function mulberry32(a) {
    return function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        var t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function lerp(start, end, amt, fill) {
    if (fill === 'bottom') {
        return end - start * amt;
    } else {
        return (end - start) * amt;
    }
}

class HoudiniSnow {
    static get inputProperties() {
        return [
            `--${WORKLET}-min`,
            `--${WORKLET}-max`,
            `--${WORKLET}-fill`,
            `--${WORKLET}-flakes`,
        ];
    }

    paint(ctx, size, properties) {
        const { width, height } = size;

        const min = parseInt(properties.get(`--${WORKLET}-min`)) || 2;
        const max = parseInt(properties.get(`--${WORKLET}-max`)) || 7;

        const fill =
            properties.get(`--${WORKLET}-fill`).toString().trim() || 'all';

        const flakes = parseInt(properties.get(`--${WORKLET}-flakes`)) || 1000;

        const random = mulberry32(flakes);

        const startPos = fill === 'bottom' ? height / 2 : 0;
        const endPos = fill === 'top' ? height / 2 : height;

        const snowflakeArr = [...Array(flakes)].map(() => {
            return {
                x: lerp(0, width, random()),
                y: lerp(startPos, endPos, random(), fill),
            };
        });

        snowflakeArr.forEach((point) => {
            ctx.fillStyle = `hsla(0 0% 100% / ${lerp(0.4, 1, random())})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, lerp(min, max, random()), 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

registerPaint(WORKLET, HoudiniSnow);
