import { MemoType } from "@/types/types";
import { useMemo } from "react";

type MemoProp = {
  memo: Partial<MemoType>;
};

export const Memo = function ({ memo }: MemoProp) {
  /** 지정된 메모 타입에 따라 내용 부분 다르게 렌더링 */
  const MemoContent = useMemo(() => {
    if (!memo || !memo.memoType) return TextMemo;

    switch (memo.memoType) {
      case 0:
        return TextMemo;
      default:
        return TextMemo;
    }
  }, [memo]);

  return (
    <div
      id="memo-container"
      className="absolute flex h-[8.4rem] w-[10.6rem] flex-col rounded-sm border-gray-200 bg-slate-50 px-2 py-1 shadow-sm"
      style={{
        top: memo.positionY,
        left: memo.positionX,
      }}
    >
      <div id="memo-header" className="flex-row-reverse border-b-[1px]">
        <div id="memo-owner" className="text-right text-xs">
          <label className="text-3xs">from. </label>
          {memo.user?.nickname}
        </div>
      </div>
      <div id="memo-body" className="flex-grow py-1">
        <MemoContent memo={memo} />
      </div>
      <div id="memo-footer" className="border-t-[1px] text-3xs">
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
      <div id="memo-content-text-default" className="flex overflow-hidden">
        <label className="whitespace-pre-wrap text-2xs">{memo?.content}</label>
      </div>
    </>
  );
};
