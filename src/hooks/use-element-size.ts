import { useState, useRef, useLayoutEffect, useCallback } from 'react';

export const useElementSize = <Element extends HTMLElement>() => {
    const [size, setSize] = useState({
        height: 0,
        width: 0,
    });

    const ref = useRef<Element>(null);

    const onResize = useCallback(() => {
        if (!ref.current) return;

        const newHeight = ref.current.offsetHeight;
        const newWidth = ref.current.offsetWidth;

        if (newHeight !== size.height || newWidth !== size.width) {
            setSize({
                height: newHeight,
                width: newWidth,
            });
        }
    }, [size.height, size.width]);

    useLayoutEffect(() => {
        if (!ref.current) return;

        const resizeObserver = new ResizeObserver(onResize);

        resizeObserver.observe(ref.current);

        return () => resizeObserver.disconnect();
    }, [ref, onResize]);

    return {
        ref,
        ...size,
    };
};
