import { RefObject, useState, useEffect } from 'react';

export const useElementSize = (elementRef: RefObject<HTMLDivElement>) => {
    const [elementSize, setElementSize] = useState<{
        width?: number;
        height?: number;
    }>({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        const handleResize = () => {
            if (!elementRef.current) return;

            const { offsetWidth: width, offsetHeight: height } =
                elementRef.current;

            setElementSize({ width, height });
        };

        window?.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window?.removeEventListener('resize', handleResize);
        };
    }, [elementRef]);

    return elementSize;
};
