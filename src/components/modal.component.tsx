import { MemoType } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

type ModalProp = {
  /** Inject visibility state and its dispatcher to modal */
  visibilityState: [boolean, Dispatch<SetStateAction<boolean>>];
  /** Additional action on sumbit */
  onSubmit?: () => void;
};

type MemoEditModalProp = ModalProp & {
  memoObjectState: [
    Partial<MemoType>,
    Dispatch<SetStateAction<Partial<MemoType>>>
  ];
};

export const MemoEditModal = function ({
  visibilityState: [isVisible, setIsVisible],
  memoObjectState: [memoObject, setMemoObject],
  onSubmit,
}: MemoEditModalProp) {
  /** 모달 내에서 변경점을 미리 담아둘 state들 */
  const [memoTextContent, setMemoTextContent] = useState("");
  const [memoType, setMemoType] = useState(0);

  /** memoType에 의해 변경되는 값들 */
  const [memoTextLimit, setMemoTextLimit] = useState(0);
  const [memoTextRows, setMemoTextRows] = useState(0);
  const [isTextLengthOver, setIsTextLengthOver] = useState(false);

  useEffect(() => {
    setMemoTextContent(memoObject.content || "");
  }, [memoObject.content]);

  useEffect(() => {
    setMemoType(memoObject.memoType || 0);

    switch (memoObject.memoType) {
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
  }, [memoObject.memoType]);

  useEffect(() => {
    setIsTextLengthOver(memoTextContent.length > memoTextLimit);
  }, [memoTextContent, memoTextLimit]);

  /** 오버레이 부분 클릭 시 작성 중 메모 처리 */
  const handleOnOverlayClick = useCallback(() => {
    if (memoTextContent === "" || memoTextContent === memoObject.content) {
      setIsVisible(false);
    } else if (confirm("작성한 메모가 지워집니다.")) {
      setMemoTextContent(memoObject.content ?? "");
      setIsVisible(false);
    }
  }, [memoObject.content, memoTextContent, setIsVisible]);

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
            onClick={handleOnOverlayClick}
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
                className="min-h-0 w-full resize-none bg-transparent text-xl focus:outline-none"
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
                } ${"w-20"}`}
              >
                {memoTextContent.length}/{memoTextLimit}
              </div>
              <div id="memo-text-counter-container">
                <select
                  value={memoType}
                  onChange={(event) => setMemoType(+event.target.value)}
                  className="pl-2 pr-2"
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
                  disabled={isTextLengthOver || memoTextContent.length === 0}
                  onClick={() => {
                    setIsVisible(false);

                    setMemoObject({
                      memoType: memoType,
                      content: memoTextContent,
                    });

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
