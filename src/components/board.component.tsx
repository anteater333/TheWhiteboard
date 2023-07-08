"use client";

import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  WheelEvent,
} from "react";
import { AddButton, OnGoingMemoButton } from "./buttons.component";
import { Memo, memoHeight, memoWidth } from "./memo.component";
import { motion } from "framer-motion";
import { MemoEditModal } from "./modal.component";
import { MemoType } from "@/types/types";

const boardWidth = memoWidth * 10;
const boardHeight = memoHeight * 7.5;

const borderPadding = 32;

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
  const [posX, setPosX] = useState(-(borderPadding / 2));
  const [posY, setPosY] = useState(-(borderPadding / 2));
  const [startMouseX, setStartMouseX] = useState(0);
  const [startMouseY, setStartMouseY] = useState(0);

  const [isDragging, setIsDragging] = useState(false);

  const [showAddList, setShowAddList] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editingMemo, setEditingMemo] = useState<Partial<MemoType>>({
    memoType: 0,
  });
  const [isPostingMode, setIsPostingMode] = useState(false);

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
    setShowAddList(false);
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
        margin -
        borderPadding;
      const negativeYThreshold =
        window.innerHeight / scale -
        (boardHeight * (scale + 1)) / (2 * scale) -
        112 / scale - // Header/Footer 높이 감안
        margin -
        borderPadding;

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

  // #region For posting mode
  /** Posting mode 진입 시 board에 점선 표시 */
  useEffect(() => {
    setIsPostingMode(!!editingMemo.content);
  }, [editingMemo.content]);

  const BoardGrid = useMemo(() => {
    if (!isPostingMode) return;

    return (
      <>
        <>
          {/* 세로줄 메인 */}
          {Array(9)
            .fill(0)
            .map((_, idx) => {
              return (
                <div
                  key={`grid-vertical-main-${idx}`}
                  className="absolute border-r-2 border-dashed border-stone-200"
                  style={{
                    left: `${memoWidth * idx}px`,
                    width: `${memoWidth}px`,
                    height: `${boardHeight}px`,
                  }}
                />
              );
            })}
          {/* 세로줄 서브 */}
          {Array(10 * 4)
            .fill(0)
            .map((_, idx) => {
              return (
                <div
                  key={`grid-vertical-sub-${idx}`}
                  className="absolute border-r-2 border-dotted border-stone-200"
                  style={{
                    left: `${(memoWidth / 4) * idx}px`,
                    width: `${memoWidth / 4}px`,
                    height: `${boardHeight}px`,
                  }}
                />
              );
            })}
          {/* 가로줄 메인 */}
          {Array(7)
            .fill(0)
            .map((_, idx) => {
              return (
                <div
                  key={`grid-horizontal-main-${idx}`}
                  className="absolute border-b-2 border-dashed border-stone-200"
                  style={{
                    top: `${memoHeight * idx}px`,
                    width: `${boardWidth}px`,
                    height: `${memoHeight}px`,
                  }}
                />
              );
            })}
          {/* 가로줄 서브 */}
          {Array(7.25 * 4)
            .fill(0)
            .map((_, idx) => {
              return (
                <div
                  key={`grid-horizontal-sub-${idx}`}
                  className="absolute border-b-2 border-dotted border-stone-200"
                  style={{
                    top: `${(memoHeight / 4) * idx}px`,
                    width: `${boardWidth}px`,
                    height: `${memoHeight / 4}px`,
                  }}
                />
              );
            })}
        </>
      </>
    );
  }, [isPostingMode]);
  // #endregion

  return (
    <>
      {/* <div id="debugger" className="fixed left-1/2 top-1/2 z-50 text-5xl">
        <div className="">{`${posX.toFixed(2)}, ${posY.toFixed(2)}`}</div>
        <div>{`${scale.toFixed(2)}`}</div>
        <div>{`${JSON.stringify(editingMemo)}`}</div>
      </div> */}

      {/* 새 메모 입력 모달 */}
      <MemoEditModal
        visibilityState={[showEditModal, setShowEditModal]}
        memoObjectState={[editingMemo, setEditingMemo]}
      />

      {/* 메모 추가 관련 버튼 */}
      <>
        <div className="absolute bottom-6 right-4 z-30 flex w-fit flex-col items-end">
          {showAddList ? (
            <AddMemoList
              onSelected={(selected) => {
                if (
                  !editingMemo.content ||
                  (editingMemo.content !== "" &&
                    confirm("작성 중인 메모가 지워집니다."))
                ) {
                  // 새 메모 작성에 돌입.
                  setEditingMemo({ memoType: selected });
                  setShowEditModal(true);
                }

                setShowAddList(false);
              }}
            />
          ) : undefined}
          <AddButton
            isActive={showAddList}
            onClick={() => {
              setShowAddList(!showAddList);
            }}
          />
        </div>
        <div className="absolute bottom-6 left-4 z-30 w-fit">
          {editingMemo.content ? (
            <OnGoingMemoButton
              onClick={() => {
                setShowAddList(false);
                setShowEditModal(true);
              }}
            />
          ) : undefined}
        </div>
      </>

      <div
        id="board-controller-container"
        className="absolute right-4 top-2 z-40 flex flex-col text-center font-galmuri text-2xl font-bold"
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
        className="absolute z-0 flex items-center justify-center rounded-lg bg-stone-100 shadow-circle outline-none transition-transform"
        onWheel={handleOnWheel}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseMove={handleOnMouseMove}
        onKeyDown={handleOnKeyDown}
        style={{
          width: `${boardWidth + borderPadding}px`,
          height: `${boardHeight + borderPadding}px`,
          transform: `scale(${scale}) translate(${posX}px, ${posY}px)`,
        }}
      >
        <div
          className="relative overflow-hidden rounded-lg border-2 border-stone-200 bg-stone-100"
          style={{ width: `${boardWidth}px`, height: `${boardHeight}px` }}
        >
          {BoardGrid}
          {/* 이하 테스트 데이터 */}
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
              positionX: memoWidth,
              positionY: memoHeight,
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
              positionX: memoWidth,
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
                "test\n신新 제논의 역설\n\n일을 끝마칠 때가sfsafasfasfsaf 가까워 올 수록 진행속도가 느려지는 현상\n\n신新 제논의 역설\n일을 끝afsafajdsfjlkdsajflksaㄻㅇ니ㅏㄹ멍ㄴ리ㅏㅁㅇ너ㅣㅏㄻ너리ㅏㅁ너리ㅏㅇㄴ머ㅣㅏㄹㅇㄴ머ㅣㅏㄹㅇㄴ머ㅣㅏ렁ㄴ미ㅏ런미ㅏ렁ㄴ미ㅏㄹ마칠 때가 가까워 올 수록 진행속\n도가 느려지는 adsfasfa 현상afdf",
              createdAt: Date().toString(),
              votes: [],
              referencedMemo: [],
              positionX: 0,
              positionY: memoHeight,
            }}
          />
          <Memo
            memo={{
              user: {
                nickname: "Tester",
              },
              memoType: 1,
              content:
                "신新 제논의 역설\n일을 끝마칠 때가 가까워 올 수록 진행속도가 느려지는 현상 가나다라 마바사 아자차카타파하 아야어여오요우유\ntest",
              createdAt: Date().toString(),
              votes: [],
              referencedMemo: [],
              positionX: 200,
              positionY: memoHeight * 2.5,
            }}
          />
          <Memo
            memo={{
              user: {
                nickname: "Tester",
              },
              memoType: 1,
              content:
                "신新 제논의 역설\n일을 끝마칠 때가 가까워 올 수록 진행속도가 느려지는 현상 가나다라 마바사 아자차카타파하 아야어여오요우유\ntest",
              createdAt: Date().toString(),
              votes: [],
              referencedMemo: [],
              positionX: 0,
              positionY: memoHeight * 2.5,
            }}
          />
        </div>
      </div>
    </>
  );
};

type AddMemoListProp = {
  onSelected: (selected: number) => void;
};

const AddMemoList = function ({ onSelected }: AddMemoListProp) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.15 }}
      className="mb-4 flex w-[11.5rem] flex-col rounded-md bg-white p-2 font-galmuri text-lg text-black shadow-circle"
    >
      <button
        onClick={() => {
          onSelected(1);
        }}
        className="mb-1 select-none border-b-2 border-gray-100 py-1 text-right"
      >
        짧은 텍스트 메모
      </button>
      <button
        onClick={() => {
          onSelected(0);
        }}
        className="select-none py-1 text-right"
      >
        텍스트 메모
      </button>
    </motion.div>
  );
};
