"use client";

import { MouseEvent, useCallback, useRef, useState, WheelEvent } from "react";
import { Memo, testMemoPositionData } from "./memo.component";

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

      boardRef.current?.classList.add("transition-transform");

      let newLevel = scaleLevel;
      newLevel += event.deltaY < 0 ? 1 : -1;

      // ScaleLevel 범위 제한
      newLevel = Math.min(Math.max(1, newLevel), numOfLevels);

      setScaleLevel(newLevel);
      setScale(newLevel * minScale);
    },
    [scaleLevel]
  );

  // #region Board 이동 관련
  const handleOnMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      boardRef.current?.classList.remove("transition-transform");

      setStartMouseX(event.clientX);
      setStartMouseY(event.clientY);
      setIsDragging(true);
    },
    []
  );

  const handleOnMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleOnMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
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
    },
    [isDragging, scaleLevel, startMouseX, startMouseY]
  );
  // #endregion

  return (
    <div
      ref={boardRef}
      className="absolute z-0 h-[1230px] w-[2000px] border-gray-300 bg-stone-100 shadow-md transition-transform"
      onWheel={handleOnWheel}
      onMouseDown={handleOnMouseDown}
      onMouseUp={handleOnMouseUp}
      onMouseMove={handleOnMouseMove}
      style={{
        transform: `scale(${scale}) translate(${posX}px, ${posY}px)`,
      }}
    >
      <div className="fixed left-1/2 top-80 z-50 text-9xl">{scaleLevel}</div>
      <Memo
        memo={{
          user: {
            nickname: "Tester",
          },
          memoType: 0,
          title: "Title, Deprecated.",
          content:
            "신新 제논의 역설\n\n일을 끝마칠 때가 가까워 올 수록 진행속도가 느려지는 현상",
          createdAt: Date().toString(),
          votes: [],
          referencedMemo: [],
          positionX: 0,
          positionY: 0,
        }}
      />
      <Memo
        memo={{
          user: {
            nickname: "Tester",
          },
          memoType: 0,
          title: "Title, Deprecated.",
          content:
            "신新 제논의 역설\n\n일을 끝마칠 때가 가까워 올 수록 진행속도가 느려지는 현상\n\n신新 제논의 역설\n\n일을 끝마칠 때가 가까워 올 수록 진행속도가 느려지는 현상",
          createdAt: Date().toString(),
          votes: [],
          referencedMemo: [],
          positionX: testMemoPositionData.w,
          positionY: testMemoPositionData.h,
        }}
      />
      <Memo
        memo={{
          user: {
            nickname: "Tester",
          },
          memoType: 0,
          title: "Title, Deprecated.",
          content:
            "신新 제논의 역설\n\n일을 끝마칠 때가 가까워 올 수록 진행속도가 느려지는 현상\n\n신新 제논의 역설\n\n일을 끝마칠 때가 가까워 올 수록 진행속도가 느려지는 현상",
          createdAt: Date().toString(),
          votes: [],
          referencedMemo: [],
          positionX: testMemoPositionData.w,
          positionY: 0,
        }}
      />
      <Memo
        memo={{
          user: {
            nickname: "Tester",
          },
          memoType: 0,
          title: "Title, Deprecated.",
          content:
            "신新 제논의 역설\n\n일을 끝마칠 때가 가까워 올 수록 진행속도가 느려지는 현상\n\n신新 제논의 역설\n\n일을 끝마칠 때가 가까워 올 수록 진행속도가 느려지는 현상",
          createdAt: Date().toString(),
          votes: [],
          referencedMemo: [],
          positionX: 0,
          positionY: testMemoPositionData.h,
        }}
      />
      <Memo
        memo={{
          user: {
            nickname: "Tester",
          },
          memoType: 1,
          content:
            "신新 제논의 역설\n\n일을 끝마칠 때가 가까워 올 수록 진행속도가 느려지는 현상 가나다라 마바사 아자차카타파하 아야어여오요우유",
          createdAt: Date().toString(),
          votes: [],
          referencedMemo: [],
          positionX: 200,
          positionY: 448,
    <>
      <div id="debugger" className="fixed left-1/2 top-1/2 z-50 text-5xl">
        <div className="">{`${posX.toFixed(2)}, ${posY.toFixed(2)}`}</div>
      </div>
        }}
      />
    </div>
    </>
  );
};
