export type MemoType = {
  id: string;
  user: Partial<UserType>;
  board: Partial<BoardType>;
  referencingMemo: Partial<MemoType>;
  referencedMemo: Partial<MemoType>[];
  memoType: number;
  title: string;
  content: string;
  imageUrlFirst: string;
  imageUrlSecond: string;
  isWriting: boolean;
  pageNum: number;
  positionX: number;
  positionY: number;
  votes: Partial<VoteType>[];
  createdAt: string;
  updatedAt: string;
};

export type BoardType = {
  id: string;
  memos: Partial<MemoType>[];
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
  memos: Partial<MemoType>[];
  votes: Partial<VoteType>[];
  createdAt: string;
  updatedAt: string;
};

export type VoteType = {
  id: string;
  memo: Partial<MemoType>;
  user: Partial<UserType>;
  isUp: boolean;
  createdAt: string;
  updatedAt: string;
};
