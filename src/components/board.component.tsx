"use client";

/**
 * The Whiteboard Core Component
 */

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
import {
  AddButton,
  OnGoingMemoButton,
  PositionConfirmButton,
} from "./buttons.component";
import { Memo } from "./memo.component";
import { motion } from "framer-motion";
import { MemoEditModal } from "./modal.component";
import { MemoType } from "@/types/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { validateMemoPosition } from "@/utils/validator";
import {
  boardWidth,
  boardHeight,
  memoHeight,
  memoWidth,
} from "@/constants/size";
import { GraphQLError } from "graphql";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNewMemoMutation } from "@/libs/apollo/memoQueries";

const borderPadding = 32;

const numOfLevels = 8;
const maxScale = 8;
const minScale = maxScale / numOfLevels;

type BoardProp = {
  memoList: Partial<MemoType>[];
};

/**
 * The Whiteboard. Memo들의 집합.
 * 확대 이동 등의 기능 제공.
 * @returns
 */
export const Board = function ({ memoList }: BoardProp) {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const session = useSession();
  const router = useRouter();

  const [scaleLevel, setScaleLevel] = useState(1);
  const [scale, setScale] = useState(scaleLevel * minScale);
  const [posX, setPosX] = useState(-(borderPadding / 2));
  const [posY, setPosY] = useState(-(borderPadding / 2));
  const [startMouseX, setStartMouseX] = useState(0);
  const [startMouseY, setStartMouseY] = useState(0);

  const [isDragging, setIsDragging] = useState(false);

  const [showAddList, setShowAddList] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // #region For posting mode
  const [editingMemo, setEditingMemo] = useState<Partial<MemoType>>({});
  const [editingMemoPosX, setEditingMemoPosX] = useState(0);
  const [editingMemoPosY, setEditingMemoPosY] = useState(0);
  const [isPostingMode, setIsPostingMode] = useState(false);
  /** Posting Mode에서 화면 고정 여부 */
  const [isBoardFixed, setIsBoardFixed] = useState(false);
  /** 화면 고정 이후 메모 위치 선택 여부 */
  const [isMemoPasted, setIsMemoPasted] = useState(false);
  /** 메모가 유효하지 않은 위치에 존재하는지 */
  const [isPosInvalid, setIsPosInvalid] = useState(false);

  /** 새 메모 생성 API 호출 */
  const [postNewMemo, { error, loading }] = useNewMemoMutation({
    boardName: "world",
    pageNum: 1,
    content: editingMemo.content,
    memoType: editingMemo.memoType,
    positionX: editingMemoPosX,
    positionY: editingMemoPosY,
    userId: session.data?.user.id,
  });

  /** Posting mode에서 사용하는 자리잡기 용도 메모 컴포넌트 */
  const EditingMemoComponent = useMemo(() => {
    if (!isPostingMode) return;

    return (
      <Memo
        memo={{
          positionX: editingMemoPosX,
          positionY: editingMemoPosY,
          votes: [],
          referencedMemo: [],
          ...editingMemo,
        }}
        isPostingMode={true}
        isPosInvalid={isPosInvalid}
        isBoardFixed={isBoardFixed}
        isMemoPasted={isMemoPasted}
        isDragging={isDragging}
        onPasted={() => {
          setIsMemoPasted(!isMemoPasted);
        }}
      />
    );
  }, [
    editingMemo,
    isPostingMode,
    isBoardFixed,
    editingMemoPosX,
    editingMemoPosY,
    isMemoPasted,
    isPosInvalid,
    isDragging,
  ]);

  /** 메모 입력 확인 시 Posting mode 진입 */
  useEffect(() => {
    setIsPostingMode(!!editingMemo.content);
  }, [editingMemo.content]);

  /** 메모 위치 유효 여부 계산 */
  useEffect(() => {
    const isValid = validateMemoPosition(
      editingMemo.memoType,
      editingMemoPosX,
      editingMemoPosY,
      memoList
    );

    setIsPosInvalid(!isValid);
  }, [editingMemoPosX, editingMemoPosY, editingMemo.memoType, memoList]);

  /** Posting mode에서 board에 점선 표시 */
  const BoardGrid = useMemo(() => {
    if (!isPostingMode) return;

    return (
      <>
        <>
          {/* 세로줄 */}
          {Array(10 * 4)
            .fill(0)
            .map((_, idx) => {
              return (
                <div
                  key={`grid-vertical-${idx}`}
                  className="absolute border-stone-300"
                  style={{
                    left: `${(memoWidth / 4) * idx}px`,
                    width: `${memoWidth / 4}px`,
                    height: `${boardHeight}px`,
                    borderStyle: idx % 4 === 3 ? `solid` : `dashed`,
                    borderRightWidth: idx % 4 === 3 ? `2px` : `1px`,
                  }}
                />
              );
            })}
          {/* 가로줄 */}
          {Array(7.25 * 4)
            .fill(0)
            .map((_, idx) => {
              return (
                <div
                  key={`grid-horizontal-${idx}`}
                  className="absolute border-stone-300"
                  style={{
                    top: `${(memoHeight / 4) * idx}px`,
                    width: `${boardWidth}px`,
                    height: `${memoHeight / 4}px`,
                    borderStyle: idx % 4 === 3 ? `solid` : `dashed`,
                    borderBottomWidth: idx % 4 === 3 ? `2px` : `1px`,
                  }}
                />
              );
            })}
        </>
      </>
    );
  }, [isPostingMode]);

  const handlePositionOnPostingMode = useCallback(
    (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      if (!isPostingMode || isMemoPasted) {
        return;
      }

      const bounds = event.currentTarget.getBoundingClientRect();
      const mouseX =
        event.clientX / scale - bounds.left / scale - memoWidth / 3;
      const mouseY =
        event.clientY / scale - bounds.top / scale - memoHeight / 8;

      const factorX = memoWidth / 4;
      const factorY = memoHeight / 4;

      const posX = factorX * Math.floor(mouseX / factorX);
      const posY = factorY * Math.floor(mouseY / factorY);

      setEditingMemoPosX(posX);
      setEditingMemoPosY(posY);
    },
    [scale, isPostingMode, isMemoPasted]
  );

  /** Posting Mode 종료 */
  const quitPostingMode = useCallback(() => {
    setEditingMemo({});
    setIsBoardFixed(false);
    setIsPostingMode(false);
    setIsMemoPasted(false);
  }, []);

  /** + 버튼을 눌렀을 때의 행동 */
  const handleOnAddButton = useCallback(() => {
    if (!isPostingMode) setShowAddList(!showAddList);
    else if (confirm("작성 중인 메모가 지워집니다.")) {
      quitPostingMode();
    }
  }, [isPostingMode, quitPostingMode, showAddList]);

  /** Posting Mode에서 화면 하단 중앙의 확인 버튼의 행동 */
  const handleOnConfirmButton = useCallback(async () => {
    if (loading) return; // do nothing

    router.refresh();

    if (!isBoardFixed) {
      // 화면 고정
      setIsDragging(false);
      setIsBoardFixed(true);
    } else if (isMemoPasted) {
      // 메모 위치 고정까지 완료됨
      // 서버에 메모 저장 로직
      if (!confirm("제출하시겠습니까?")) return;
      try {
        await postNewMemo();
      } catch (error) {
        if (error instanceof GraphQLError) {
          toast(`메모 생성 중 에러 발생 ${error.extensions.code}`, {
            type: "error",
          });
          console.error(error);
        } else {
          toast(`메모 생성 중 에러 발생 ${error}`, {
            type: "error",
          });

          console.error(error);
        }
        return;
      }

      // 새로고침
      router.refresh();

      toast(`Posted!`, {
        type: "success",
      });

      quitPostingMode();
    } else {
      // 화면 고정 해제
      setIsBoardFixed(false);
    }
  }, [
    isBoardFixed,
    isMemoPasted,
    loading,
    postNewMemo,
    quitPostingMode,
    router,
  ]);
  // #endregion

  // #region Board 이동&확대 관련
  /** 1단계 확대 */
  const scaleUp = useCallback(() => {
    if (scaleLevel >= maxScale || isPostingMode) {
      return;
    }

    const newScale = scaleLevel + 1;
    boardRef.current?.classList.add("transition-transform");
    setScale(newScale * minScale);
    setScaleLevel(newScale);
    boardRef.current?.focus();
  }, [scaleLevel, isPostingMode]);

  /** 1단계 축소 */
  const scaleDown = useCallback(() => {
    if (scaleLevel <= 1 || isPostingMode) {
      return;
    }

    const newScale = scaleLevel - 1;
    boardRef.current?.classList.add("transition-transform");
    setScale(newScale * minScale);
    setScaleLevel(newScale);
    boardRef.current?.focus();
  }, [scaleLevel, isPostingMode]);

  /** Board 이동/확대 초기화 */
  const resetBoard = useCallback(() => {
    setScale(1);
    setScaleLevel(1);
    setPosX(0);
    setPosY(0);
    setIsDragging(false);
    boardRef.current?.focus();
  }, []);

  /** Posting mode 진입 시 화면 확대 초기화 및 고정 */
  useEffect(() => {
    if (isPostingMode) resetBoard();
  }, [isPostingMode, resetBoard]);

  /** Board 영역에 대한 Wheel 행동 처리 */
  const handleBoardOnWheel = useCallback(
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

  const handleBoardOnKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      switch (event.code) {
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
        case "Space":
          if (!isPostingMode) return;
          handleOnConfirmButton();
          break;
      }
    },
    [scale, isPostingMode, handleOnConfirmButton]
  );

  const handleBoardOnMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      if (isBoardFixed) return;

      boardRef.current?.classList.remove("transition-transform");

      setStartMouseX(event.clientX);
      setStartMouseY(event.clientY);
      setIsDragging(true);
    },
    [isBoardFixed]
  );

  const handleBoardOnMouseUp = useCallback(() => {
    setIsDragging(false);
    setShowAddList(false);
  }, []);

  const handleBoardOnMouseMove = useCallback(
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

      const margin = 256 / scale;

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

  return (
    <>
      {/* Toastify */}
      <ToastContainer
        toastStyle={{ fontFamily: "galmuri11", fontWeight: "bold" }}
        position="top-left"
      />

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
        <div className="absolute bottom-20 right-4 z-40 flex w-fit flex-col items-end">
          {showAddList ? (
            <AddMemoList
              onSelected={(selected) => {
                // 새 메모 작성에 돌입.
                setEditingMemo({ memoType: selected });
                setShowEditModal(true);
                setShowAddList(false);
              }}
            />
          ) : undefined}
          <AddButton
            isActive={showAddList || isPostingMode}
            onClick={handleOnAddButton}
          />
        </div>
        <div className="absolute bottom-20 left-4 z-40 w-fit">
          {editingMemo.content ? (
            <OnGoingMemoButton
              onClick={() => {
                setShowAddList(false);
                setShowEditModal(true);
              }}
            />
          ) : undefined}
        </div>

        {isPostingMode ? (
          <div className="absolute bottom-20 left-0 right-0 z-30 mx-auto w-44">
            <PositionConfirmButton
              texts={{
                keyText: loading ? "" : "space",
                state1Text: "화면 고정",
                state2Text: loading
                  ? "Loading..."
                  : isBoardFixed && isMemoPasted
                  ? "Post-it!"
                  : "고정 취소",
              }}
              isActive={!isBoardFixed}
              onClick={handleOnConfirmButton}
            />
          </div>
        ) : undefined}
      </>

      {isBoardFixed ? undefined : (
        <div
          id="board-controller-container"
          className="absolute right-4 top-2 z-40 flex flex-col text-center font-galmuri text-2xl font-bold"
        >
          <button onClick={() => scaleUp()}>+</button>
          <label className="pb-1 pt-2 text-base">{scaleLevel}</label>
          <button onClick={() => scaleDown()}>-</button>
          <button className="mt-1" onClick={resetBoard}>
            ↻
          </button>
        </div>
      )}
      <div
        id="board"
        tabIndex={1}
        ref={boardRef}
        className="absolute z-0 flex items-center justify-center rounded-lg bg-stone-100 shadow-circle outline-none transition-transform"
        onWheel={handleBoardOnWheel}
        onMouseDown={handleBoardOnMouseDown}
        onMouseUp={handleBoardOnMouseUp}
        onMouseMove={handleBoardOnMouseMove}
        onKeyDown={handleBoardOnKeyDown}
        style={{
          width: `${boardWidth + borderPadding}px`,
          height: `${boardHeight + borderPadding}px`,
          transform: `scale(${scale}) translate(${posX}px, ${posY}px)`,
        }}
      >
        <div
          className="relative cursor-grab overflow-hidden rounded-lg border-2 border-stone-300 bg-stone-100"
          onMouseMove={handlePositionOnPostingMode}
          style={{ width: `${boardWidth}px`, height: `${boardHeight}px` }}
        >
          <>
            {BoardGrid}
            {EditingMemoComponent}
            {memoList.map((memoObj, idx) => (
              <Memo key={`board-memo-${idx}`} memo={memoObj} />
            ))}
          </>
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
