export type MemoType = {
  id: string;
  user: UserType;
  board: BoardType;
  referencingMemo: MemoType;
  referencedMemo: MemoType;
  memoType: number;
  title: string;
  content: string;
  imageUrlFirst: string;
  imageUrlSecond: string;
  isWriting: boolean;
  pageNum: number;
  positionX: number;
  positionY: number;
  votes: VoteType;
  createdAt: string;
  updatedAt: string;
};

export type BoardType = {
  id: string;
  memos: MemoType[];
  name: string;
  description: string;
  pageCount: number;
  createdAt: string;
  updatedAt: string;
};

export type UserType = {
  id: string;
  oauthProvider: string;
  nickname: string;
  memos: MemoType[];
  votes: VoteType[];
  createdAt: string;
  updatedAt: string;
};

export type VoteType = {
  id: string;
  memo: MemoType;
  user: UserType;
  isUp: boolean;
  createdAt: string;
  updatedAt: string;
};
