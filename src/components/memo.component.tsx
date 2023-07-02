import { MemoType } from "@/types/types";
import { formatDate } from "@/utils/formatter";
import { useMemo } from "react";

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
      className="absolute flex h-fit w-[10.6rem] flex-col rounded-sm border-gray-200 bg-slate-50 px-2 py-1 shadow-sm"
      style={{
        top: memo.positionY,
        left: memo.positionX,
      }}
    >
      <div id="memo-header" className="flex-row-reverse border-b-[1px]">
        <div id="memo-owner" className="text-right text-xs">
          <label className="font-galmuri text-3xs font-bold">from. </label>
          {memo.user?.nickname}
        </div>
      </div>
      <div id="memo-body" className="min-h-0 flex-grow overflow-hidden py-1">
        <MemoContent memo={memo} />
      </div>
      <div
        id="memo-footer"
        className="min-w-0 border-t-[1px] font-galmuri text-3xs font-bold"
      >
        <div id="memo-footer-slot-1" className="">
          <div id="memo-date">{memo.createdAt}</div>
        </div>
        <div id="memo-footer-slot-2" className="flex">
          <div id="memo-votes-conatiner">
            <button id="memo-upvote"></button>
            <label id="memo-votes">{memo.votes?.length}</label>
            <button id="memo-downvote"></button>
          </div>
          <div id="memo-replies-container">
            <button id="memo-reply"></button>
            <label id="memo-replies">{memo.referencedMemo?.length}</label>
          </div>
          <div id="memo-share-container">
            <button id="memo-share"></button>
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
        <label className="line-clamp-[8] whitespace-pre-wrap text-2xs">
          {memo?.content}
        </label>
      </div>
    </>
  );
};

export const TextShortMemo = function ({ memo }: Partial<MemoProp>) {
  return (
    <>
      <div id="memo-content-text-small" className="flex h-12 w-full">
        <label className="line-clamp-4 whitespace-pre-wrap text-2xs">
          {memo?.content}
        </label>
      </div>
    </>
  );
};
