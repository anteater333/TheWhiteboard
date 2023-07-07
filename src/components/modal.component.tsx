import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type ModalProp = {
  /** Inject visibility state and its dispatcher to modal */
  visibilityState: [boolean, Dispatch<SetStateAction<boolean>>];
  onSubmit?: () => void;
};

type MemoEditModalProp = ModalProp & {
  initialMemoType?: number;
};

export const MemoEditModal = function ({
  visibilityState: [isVisible, setIsVisible],
  initialMemoType = 0,
  onSubmit,
}: MemoEditModalProp) {
  const [memoTextContent, setMemoTextContent] = useState("");
  const [memoType, setMemoType] = useState(initialMemoType);
  const [memoTextLimit, setMemoTextLimit] = useState(0);
  const [memoTextRows, setMemoTextRows] = useState(0);
  const [isTextLengthOver, setIsTextLengthOver] = useState(false);

  useEffect(() => {
    switch (memoType) {
      case 0:
        setMemoTextLimit(200);
        setMemoTextRows(6);
        break;
      case 1:
        setMemoTextLimit(100);
        setMemoTextRows(2);
        break;
      default:
        break;
    }
  }, [memoType]);

  useEffect(() => {
    setIsTextLengthOver(memoTextContent.length > memoTextLimit);
  }, [memoTextContent, memoTextLimit]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="memo-edit-modal"
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          exit={{ opacity: 0 }}
          className="absolute z-50 flex h-full w-full items-center justify-center"
        >
          <div
            id="modal-overlay"
            onClick={() => {
              setIsVisible(false);
            }}
            className="absolute h-full w-full cursor-pointer bg-black bg-opacity-75"
          />

          <div
            id="memo-edit-modal-body"
            className="z-50 flex h-fit w-[40rem] flex-col rounded-xl bg-slate-50 p-4"
          >
            <div id="memo-edit-modal-header" className="border-b-2 pb-2">
              <div id="memo-to" className="font-galmuri text-3xl font-bold">
                <label className="text-xl">to. </label>
                {"world"}
              </div>
            </div>
            <div id="memo-edit-modal-body" className="border-b-2 py-2">
              <textarea
                id="memo-edit-content"
                className="min-h-0 w-full resize-none text-xl focus:outline-none"
                value={memoTextContent}
                onChange={(event) => setMemoTextContent(event.target.value)}
                rows={memoTextRows}
              />
            </div>
            <div
              id="memo-edit-modal-footer"
              className="flex items-center gap-4 pt-2 font-galmuri"
            >
              <div
                id="memo-type-container"
                className={`${
                  isTextLengthOver
                    ? "font-bold text-red-500"
                    : "font-normal text-black"
                }`}
              >
                {memoTextContent.length}/{memoTextLimit}
              </div>
              <div id="memo-text-counter-container">
                <select
                  value={memoType}
                  onChange={(event) => setMemoType(+event.target.value)}
                  className="pl-1 pr-2"
                >
                  <option value={0}>텍스트 메모</option>
                  <option value={1}>짧은 텍스트 메모</option>
                </select>
              </div>
              <div
                id="memo-submit-container"
                className="flex flex-1 justify-end font-bold"
              >
                <button
                  className="rounded-md border-2 border-black px-2 transition-all enabled:hover:bg-black enabled:hover:text-white disabled:opacity-50"
                  disabled={isTextLengthOver}
                  onClick={() => {
                    setIsVisible(false);
                    if (onSubmit) onSubmit();
                  }}
                >
                  MEMO
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
