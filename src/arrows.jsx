import { useRef, useState } from 'react';
import Xarrow from 'react-xarrows';
import Draggable from 'react-draggable';

const connectPointStyle = {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: 'black',
    cursor: 'pointer',
};

const connectPointOffset = {
    left: { left: 0, top: '50%', transform: 'translate(0, -50%)' },
    right: { left: '100%', top: '50%', transform: 'translate(-100%, -50%)' },
    top: { left: '50%', top: 0, transform: 'translate(-50%, -50%)' },
    bottom: { left: '50%', top: '100%', transform: 'translate(-50%, -50%)' },
};

const ConnectPointsWrapper = ({ boxId, handler, dragRef, boxRef }) => {
    const ref1 = useRef();

    const [position, setPosition] = useState({});
    const [beingDragged, setBeingDragged] = useState(false);

    return (
        <>
            <div
                className="connectPoint"
                style={{
                    ...connectPointStyle,
                    ...connectPointOffset[handler],
                    ...position,
                }}
                draggable
                onMouseDown={(e) => e.stopPropagation()}
                onDragStart={(e) => {
                    setBeingDragged(true);
                    e.dataTransfer.setData('arrow', boxId);
                }}
                onDrag={(e) => {
                    const { offsetTop, offsetLeft } = boxRef.current;
                    const { x, y } = dragRef.current.state;
                    setPosition({
                        position: 'fixed',
                        left: e.clientX - x - offsetLeft,
                        top: e.clientY - y - offsetTop,
                        transform: 'none',
                        opacity: 0,
                    });
                }}
                ref={ref1}
                onDragEnd={(e) => {
                    console.log(e);
                    setPosition({});
                    setBeingDragged(false);
                }}
            />
            {beingDragged ? <Xarrow start={boxId} end={ref1} /> : null}
        </>
    );
};

const boxStyle = {
    border: '1px solid black',
    position: 'relative',
    padding: '20px 10px',
    height: '100px',
};

const Box = ({ text, handler, addArrow, setArrows, boxId }) => {
    const dragRef = useRef();
    const boxRef = useRef();

    return (
        <Draggable
            ref={dragRef}
            onDrag={() => {
                // rerender the arrows when the node is dragged
                setArrows((arrows) => [...arrows]);
            }}
        >
            <div
                id={boxId}
                ref={boxRef}
                style={boxStyle}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    if (e.dataTransfer.getData('arrow') === boxId) {
                        console.log(e.dataTransfer.getData('arrow'), boxId);
                    } else {
                        addArrow({
                            start: e.dataTransfer.getData('arrow'),
                            end: boxId,
                        });
                    }
                }}
            >
                {text}
                <ConnectPointsWrapper
                    {...{ boxId, handler, dragRef, boxRef }}
                />
            </div>
        </Draggable>
    );
};

export default function App() {
    const [arrows, setArrows] = useState([]);

    const addArrow = ({ start, end }) => {
        const hasSameArrow = arrows.some(
            (arrow) => arrow.start === start && arrow.end === end,
        );

        if (!hasSameArrow) {
            setArrows([
                ...arrows,
                {
                    start,
                    end,
                },
            ]);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Box
                text="drag my handler to second element"
                {...{ addArrow, setArrows, handler: 'right', boxId: 'box2_1' }}
            />
            <Box
                text="second element"
                {...{ addArrow, setArrows, handler: 'left', boxId: 'box2_2' }}
            />
            {arrows.map((ar) => (
                <Xarrow
                    start={ar.start}
                    end={ar.end}
                    key={ar.start + '-.' + ar.start}
                    {...ar}
                />
            ))}
        </div>
    );
}
