import {
  boardHeight,
  boardWidth,
  memoHeight,
  memoWidth,
} from "@/constants/size";

export function validateMemoPosition(
  memoType = 0,
  posX: number,
  posY: number,
  memoList: { memoType?: number; positionX?: number; positionY?: number }[],
) {
  const widthByType = memoWidth;
  const heightByType = memoHeight * (memoType === 1 ? 0.5 : 1);

  const editingMemoLeft = posX || 0;
  const editingMemoTop = posY || 0;
  const editingMemoRight = editingMemoLeft + widthByType;
  const editingMemoBottom = editingMemoTop + heightByType;

  // 상하좌우 계산
  let invalid =
    editingMemoLeft < 0 ||
    editingMemoTop < 0 ||
    editingMemoRight > boardWidth ||
    editingMemoBottom > boardHeight;

  // TBD : 코드 성능 평가(...)
  for (let idx = 0; idx < memoList.length; idx++) {
    if (invalid) break;

    const curMemo = memoList[idx];
    const curMemoType = curMemo.memoType;
    const left = curMemo.positionX || 0;
    const top = curMemo.positionY || 0;
    const right = left + memoWidth;
    const bottom = top + memoHeight * (curMemoType === 1 ? 0.5 : 1);

    invalid =
      (((left <= editingMemoLeft && editingMemoLeft < right) ||
        (left < editingMemoRight && editingMemoRight <= right)) &&
        ((top <= editingMemoTop && editingMemoTop < bottom) ||
          (top < editingMemoBottom && editingMemoBottom <= bottom))) ||
      (((editingMemoLeft <= left && left < editingMemoRight) ||
        (editingMemoLeft < right && right <= editingMemoRight)) &&
        ((editingMemoTop <= top && top < editingMemoBottom) ||
          (editingMemoTop < bottom && bottom <= editingMemoBottom)));
  }

  return !invalid;
}
