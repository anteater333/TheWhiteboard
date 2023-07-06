import { MemoType } from "@/types/types";
import { formatDate } from "@/utils/formatter";
import Image from "next/image";
import { useMemo } from "react";

import shareBtn from "../../public/svg/share.svg";

type MemoProp = {
  memo: Partial<MemoType>;
};

export const Memo = function ({ memo }: MemoProp) {
  /** 지정된 메모 타입에 따라 내용 부분 다르게 렌더링 */
  const MemoContent = useMemo(() => {
    if (!memo || !memo.memoType) return TextMemo;

    switch (memo.memoType) {
      case 0: // 일반 텍스트 메모
        return TextMemo;
      case 1: // 짧은 텍스트 메모
        return TextShortMemo;
      default:
        return TextMemo;
    }
  }, [memo]);

  return (
    <div
      id="memo-container"
      className="absolute m-2 flex h-fit w-[11.5rem] flex-col rounded-sm border-gray-200 bg-slate-50 px-1 py-1 shadow-sm"
      style={{
        top: memo.positionY,
        left: memo.positionX,
      }}
      onMouseDown={(event) => {
        event.stopPropagation();
      }}
    >
      <div
        id="memo-header"
        className="flex h-4 flex-row-reverse border-b-[1px] text-xs"
      >
        <div id="memo-owner" className="text-right">
          <label className="font-galmuri text-3xs font-bold">from. </label>
          {memo.user?.nickname}
        </div>
      </div>
      <div id="memo-body" className="min-h-0 flex-grow overflow-hidden py-1">
        <MemoContent memo={memo} />
      </div>
      <div
        id="memo-footer"
        className="flex h-5 min-w-0 flex-col justify-end border-t-[1px] font-galmuri text-3xs font-bold"
      >
        <div id="memo-footer-slot-1" className="">
          <div id="memo-date">{formatDate(new Date(memo.createdAt!))}</div>
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
      <div id="memo-content-text-default" className="flex h-24 w-full">
        <label className="line-clamp-[8] cursor-text whitespace-pre-wrap text-2xs">
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
        <label className="line-clamp-2 cursor-text whitespace-pre-wrap text-2xs">
          {memo?.content}
        </label>
      </div>
    </>
  );
};
