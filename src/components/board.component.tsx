"use client";

import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  WheelEvent,
} from "react";
import { Memo } from "./memo.component";

/**
 * 메모 너비 200px
 * 메모 높이 164px (기본)
 */
const testMemoPositionData = {
  w: 200,
  h: 164,
};

const boardWidth = 2000;
const boardHeight = 1240;

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

  const [scaleLevel, setScaleLevel] = useState(1);
  const [scale, setScale] = useState(scaleLevel * minScale);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [startMouseX, setStartMouseX] = useState(0);
  const [startMouseY, setStartMouseY] = useState(0);

  const [isDragging, setIsDragging] = useState(false);

  /** 1단계 확대 */
  const scaleUp = useCallback(() => {
    if (scaleLevel >= maxScale) {
      return;
    }

    const newScale = scaleLevel + 1;
    boardRef.current?.classList.add("transition-transform");
    setScale(newScale * minScale);
    setScaleLevel(newScale);
  }, [scaleLevel]);

  /** 1단계 축소 */
  const scaleDown = useCallback(() => {
    if (scaleLevel <= 1) {
      return;
    }

    const newScale = scaleLevel - 1;
    boardRef.current?.classList.add("transition-transform");
    setScale(newScale * minScale);
    setScaleLevel(newScale);
  }, [scaleLevel]);

  /** Board 영역에 대한 Wheel 행동 처리 */
  const handleOnWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.ctrlKey) {
        return;
      }

      if (event.deltaY < 0) scaleUp();
      else scaleDown();
    },
    [scaleDown, scaleUp]
  );

  // #region Board 이동 관련
  const handleOnKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          setPosX((prev) => prev + 96 / scale);
          break;
        case "ArrowRight":
          setPosX((prev) => prev - 96 / scale);
          break;
        case "ArrowUp":
          setPosY((prev) => prev + 96 / scale);
          break;
        case "ArrowDown":
          setPosY((prev) => prev - 96 / scale);
          break;
      }
    },
    [scale]
  );

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

  /** 이동 범위 제한 */
  useEffect(() => {
    if (isDragging) return;

    const timeoutId = setTimeout(() => {
      boardRef.current?.classList.add("transition-transform");

      const margin = 48 / scale;

      // 좌/상단 제한 수치
      const positiveXThreshold =
        (boardWidth * (scale - 1)) / (2 * scale) + margin;
      const positiveYThreshold =
        (boardHeight * (scale - 1)) / (2 * scale) + margin;

      // 우/하단 제한 수치
      const negativeXThreshold =
        window.innerWidth / scale -
        (boardWidth * (scale + 1)) / (2 * scale) -
        margin;
      const negativeYThreshold =
        window.innerHeight / scale -
        (boardHeight * (scale + 1)) / (2 * scale) -
        112 / scale - // Header/Footer 높이 감안
        margin;

      if (posX > positiveXThreshold) {
        setPosX(positiveXThreshold);
      }
      if (posY > positiveYThreshold) {
        setPosY(positiveYThreshold);
      }
      if (posX < negativeXThreshold) {
        setPosX(negativeXThreshold);
      }
      if (posY < negativeYThreshold) {
        setPosY(negativeYThreshold);
      }
    }, 50);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [posX, posY, scale, isDragging]);
  // #endregion

  return (
    <>
      {/* <div id="debugger" className="fixed left-1/2 top-1/2 z-50 text-5xl">
        <div className="">{`${posX.toFixed(2)}, ${posY.toFixed(2)}`}</div>
        <div>{`${scale.toFixed(2)}`}</div>
      </div> */}
      <div
        id="board-controller-container"
        className="absolute right-4 top-2 z-50 flex flex-col text-center font-galmuri text-2xl font-bold"
      >
        <button onClick={() => scaleUp()}>+</button>
        <label className="pb-1 pt-2 text-base">{scaleLevel}</label>
        <button onClick={() => scaleDown()}>-</button>
        <button
          className="mt-1"
          onClick={() => {
            setScale(1);
            setScaleLevel(1);
            setPosX(0);
            setPosY(0);
            setIsDragging(false);
          }}
        >
          ↻
        </button>
      </div>
      <div
        id="board"
        tabIndex={1}
        ref={boardRef}
        className="absolute z-0 rounded-lg border-gray-300 bg-stone-100 shadow-md outline-none transition-transform"
        onWheel={handleOnWheel}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseMove={handleOnMouseMove}
        onKeyDown={handleOnKeyDown}
        style={{
          width: `${boardWidth}px`,
          height: `${boardHeight}px`,
          transform: `scale(${scale}) translate(${posX}px, ${posY}px)`,
        }}
      >
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
          }}
        />
      </div>
    </>
  );
};
