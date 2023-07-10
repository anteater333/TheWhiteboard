import { Board, Memo, User, Vote } from "@prisma/client";

export type MemoType = Memo & {
  user: Partial<UserType>;
  board: Partial<BoardType>;
  referencingMemo: Partial<MemoType>;
  referencedMemo: Partial<MemoType>[];
  votes: Partial<VoteType>[];
};

export type BoardType = Board & {
  memos: Partial<MemoType>[];
};

export type UserType = User & {
  memos: Partial<MemoType>[];
  votes: Partial<VoteType>[];
};

export type VoteType = Vote & {
  memo: Partial<MemoType>;
  user: Partial<UserType>;
};
