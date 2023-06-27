"use client";

import { useCallback, useRef, useState, WheelEvent } from "react";
import { Memo } from "./memo.component";

const numOfLevels = 8;
const maxScale = 8;
const minScale = maxScale / numOfLevels;

/**
 * The Whiteboard. Memo들의 집합.
 * 확대 이동 등의 기능 제공.
 * @returns
 */
export const Board = function () {
  const boardRef = useRef<HTMLDivElement | null>(null);

  const [scaleLevel, setScaleLevel] = useState(4);
  const [scale, setScale] = useState(scaleLevel * minScale);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [startMouseX, setStartMouseX] = useState(0);
  const [startMouseY, setStartMouseY] = useState(0);

  const [isDragging, setIsDragging] = useState(false);

  /** Board 영역을 확대/축소 */
  const handleOnWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.ctrlKey) {
        return;
      }

      let newLevel = scaleLevel;
      newLevel += event.deltaY < 0 ? 1 : -1;

      // ScaleLevel 범위 제한
      newLevel = Math.min(Math.max(1, newLevel), numOfLevels);

      setScaleLevel(newLevel);
      setScale(newLevel * minScale);
    },
    [scaleLevel]
  );

  return (
    <div
      className="absolute z-0 h-screen w-screen bg-sky-500 transition-transform"
      onWheel={handleOnWheel}
      onMouseDown={(event) => {
        setStartMouseX(event.clientX);
        setStartMouseY(event.clientY);
        setIsDragging(true);
      }}
      onMouseUp={(event) => {
        setIsDragging(false);
      }}
      onMouseMove={(event) => {
        if (!isDragging) {
          return;
        }

        setPosX((prev) => {
          return prev - (startMouseX - event.clientX) / scaleLevel;
        });
        setPosY((prev) => {
          return prev - (startMouseY - event.clientY) / scaleLevel;
        });

        setStartMouseX(event.clientX);
        setStartMouseY(event.clientY);
      }}
      style={{
        transform: `scale(${scale}) translate(${posX}px, ${posY}px)`,
      }}
    >
      <div className="fixed left-1/2 top-96 z-50 text-9xl">{scaleLevel}</div>
      <Memo />
    </div>
  );
};
