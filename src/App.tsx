import React, { useState, useEffect, useRef, useCallback, FC } from "react";
import "./index.css";
import {
    DEFAULT_POSITION_X,
    DEFAULT_POSITION_Y,
    ARROW_DOWN_CODE,
    ARROW_LEFT_CODE,
    ARROW_RIGHT_CODE,
    ARROW_UP_CODE,
    CONTAINER_FIELD_SIZE,
    BACKGROUND_TOP_OFFSET,
    BACKGROUND_LEFT_OFFSET,
    BACKGROUND_FIELD_SIZE,
} from "./constants";

type IUpdater = (boxPosition: { x: number; y: number }) => {
    x: number;
    y: number;
};

const App: FC = () => {
    const [boxPosition, setBoxPosition] = useState({
        x: DEFAULT_POSITION_X,
        y: DEFAULT_POSITION_Y,
    });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const blueRef = useRef<HTMLDivElement | null>(null);
    const redRef = useRef<HTMLDivElement | null>(null);

    const setNewPosition = useCallback((updater: IUpdater) => {
        setBoxPosition((previousPosition) => {
            const { x, y } = updater(previousPosition);

            const [blueBoxW, blueBoxH] = [
                blueRef.current!.offsetWidth,
                blueRef.current!.offsetHeight,
            ];

            const [redBoxW, redBoxH] = [
                redRef.current!.offsetWidth,
                redRef.current!.offsetHeight,
            ];

            // clamp number
            const newX = Math.min(
                blueBoxW - redBoxW / 2,
                Math.max(0 + redBoxW / 2, x)
            );
            const newY = Math.min(
                blueBoxH - redBoxH / 2,
                Math.max(0 + redBoxH / 2, y)
            );

            return {
                x: newX,
                y: newY,
            };
        });
    }, []);

    // drag
    useEffect(() => {
        const onMouseMove = (event: MouseEvent) => {
            if (isDragging) {
                setNewPosition(() => ({
                    x: event.x - blueRef.current!.offsetLeft,
                    y: event.y - blueRef.current!.offsetTop,
                }));
            }
        };

        const onMouseDown = () => {
            setIsDragging(true);
        };
        const onMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mouseup", onMouseUp);

        return () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mouseup", onMouseDown);
        };
    }, [setNewPosition, setIsDragging, isDragging]);

    // keyboad
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            // divide step size for the ability to move square in the middle of blue box
            const step = redRef.current!.offsetHeight / 2;
            switch (event.key) {
                case ARROW_DOWN_CODE:
                    return setNewPosition((boxPosition) => ({
                        x: boxPosition.x,
                        y: boxPosition.y + step,
                    }));
                case ARROW_UP_CODE:
                    return setNewPosition((boxPosition) => ({
                        x: boxPosition.x,
                        y: boxPosition.y - step,
                    }));
                case ARROW_LEFT_CODE:
                    return setNewPosition((boxPosition) => ({
                        x: boxPosition.x - step,
                        y: boxPosition.y,
                    }));
                case ARROW_RIGHT_CODE:
                    return setNewPosition((boxPosition) => ({
                        x: boxPosition.x + step,
                        y: boxPosition.y,
                    }));
            }
        };

        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [setNewPosition]);

    return (
        <>
            <div
                ref={blueRef}
                style={{
                    background: "#0000CD",
                    width: BACKGROUND_FIELD_SIZE,
                    height: BACKGROUND_FIELD_SIZE,
                    position: "absolute",
                    top: BACKGROUND_TOP_OFFSET,
                    left: BACKGROUND_LEFT_OFFSET,
                }}
            >
                <div
                    ref={redRef}
                    style={{
                        background: "#ff1919",
                        width: CONTAINER_FIELD_SIZE,
                        height: CONTAINER_FIELD_SIZE,
                        position: "absolute",
                        left: boxPosition.x - CONTAINER_FIELD_SIZE / 2,
                        top: boxPosition.y - CONTAINER_FIELD_SIZE / 2,
                    }}
                />
            </div>
        </>
    );
};

export default App;
