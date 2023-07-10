import { MemoType } from "@/types/types";
import { formatDate } from "@/utils/formatter";
import Image from "next/image";
import { useMemo, useState } from "react";

import shareBtn from "../../public/svg/share.svg";

/**
 * 메모 너비 200px
 * 메모 높이 180px
 */
export const memoWidth = 200;
export const memoHeight = 180;
const memoMargin = 8;

type MemoProp = {
  memo: Partial<MemoType>;
  // 이하 포스팅 모드 관련
  isPostingMode?: boolean;
  isBoardFixed?: boolean;
  isPosInvalid?: boolean;
  isMemoPasted?: boolean;
  isDragging?: boolean;
  onPasted?: () => void;
};

export const Memo = function ({
  memo,
  isPostingMode,
  isBoardFixed,
  isPosInvalid,
  isMemoPasted,
  isDragging,
  onPasted,
}: MemoProp) {
  /** 메모 컴포넌트 높이 배율 */
  const [heightScale, setHeightScale] = useState(1);

  /** 지정된 메모 타입에 따라 내용 부분 다르게 렌더링 */
  const MemoContent = useMemo(() => {
    if (memo.memoType === undefined) return TextMemo;

    switch (memo.memoType) {
      case 0: // 일반 텍스트 메모
        setHeightScale(1);
        return TextMemo;
      case 1: // 짧은 텍스트 메모
        setHeightScale(0.5);
        return TextShortMemo;
      default:
        setHeightScale(1);
        return TextMemo;
    }
  }, [memo.memoType]);

  return (
    <div
      id="memo-container"
      className={`absolute flex select-none flex-col rounded-md border-gray-200 bg-slate-50 px-1 py-1 transition-opacity ${
        isPostingMode && !isMemoPasted ? `shadow-2xl` : `shadow-md`
      }`}
      style={{
        top: memo.positionY,
        left: memo.positionX,
        margin: `${memoMargin}px`,
        width: `${memoWidth - memoMargin * 2}px`,
        height: `${memoHeight * heightScale - memoMargin * 2}px`,
        border: isPostingMode
          ? `2px ${isBoardFixed ? `solid` : `dashed`} ${
              isPosInvalid ? `red` : `black`
            }`
          : `none`,
        zIndex: isPostingMode ? `30` : `auto`,
        opacity:
          isPostingMode && isDragging
            ? `0`
            : isPostingMode && !isBoardFixed
            ? `.5`
            : `1`,
      }}
      onMouseDown={(event) => {
        if (!isPostingMode) event.stopPropagation();
        else if (isPostingMode && !isPosInvalid && isBoardFixed && !!onPasted)
          onPasted();
      }}
    >
      {isPostingMode ? (
        <div
          id="memo-overlay-on-posting-mode"
          className="absolute h-full w-full"
          style={{
            cursor: isBoardFixed ? `pointer` : `grab`,
          }}
        />
      ) : undefined}
      <div
        id="memo-header"
        className="flex h-4 flex-row-reverse border-b-[1px] text-xs"
      >
        <div id="memo-owner" className="text-right">
          <label className="font-galmuri text-3xs font-bold">from. </label>
          {memo.user?.nickname}
        </div>
      </div>
      <div
        id="memo-body"
        className="min-h-0 flex-grow cursor-pointer overflow-hidden py-1"
      >
        <MemoContent memo={memo} />
      </div>
      <div
        id="memo-footer"
        className="flex h-5 min-w-0 flex-col justify-end border-t-[1px] font-galmuri text-3xs font-bold"
      >
        <div id="memo-footer-slot-1" className="">
          <div id="memo-date">
            {memo.createdAt ? formatDate(memo.createdAt) : undefined}
          </div>
        </div>
        <div id="memo-footer-slot-2" className="flex">
          <div id="memo-votes-conatiner" className="flex">
            {/* △▽□▲▼■ */}
            <button id="memo-upvote" className="mr-1">
              △
            </button>
            <label id="memo-votes" className="mr-1 block w-3 text-center">
              {memo.votes?.length}
            </label>
            <button id="memo-downvote" className="mr-2">
              ▽
            </button>
          </div>
          <div id="memo-replies-container" className="flex">
            <button id="memo-reply" className="mr-1">
              □
            </button>
            <label id="memo-replies">{memo.referencedMemo?.length}</label>
          </div>
          <div
            id="memo-share-container"
            className="flex flex-grow flex-row-reverse"
          >
            <button id="memo-share">
              <Image
                className="pt-[1.5px]"
                alt={"share"}
                src={shareBtn}
                width={7}
                height={7}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TextMemo = function ({ memo }: Partial<MemoProp>) {
  return (
    <>
      <div id="memo-content-text-default" className="flex h-[6.75rem] w-full">
        <label className="line-clamp-[9] cursor-pointer whitespace-pre-wrap text-2xs">
          {memo?.content}
        </label>
      </div>
    </>
  );
};

export const TextShortMemo = function ({ memo }: Partial<MemoProp>) {
  return (
    <>
      <div id="memo-content-text-small" className="flex h-6 w-full">
        <label className="line-clamp-2 cursor-pointer whitespace-pre-wrap text-2xs">
          {memo?.content}
        </label>
      </div>
    </>
  );
};
