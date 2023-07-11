import { Board, Memo, User, Vote } from "@prisma/client";

export type MemoType = Omit<Memo, "createdAt" | "updatedAt"> & {
  user: Partial<UserType>;
  board: Partial<BoardType>;
  referencingMemo: Partial<MemoType>;
  referencedMemo: Partial<MemoType>[];
  votes: Partial<VoteType>[];
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type BoardType = Omit<Board, "createdAt" | "updatedAt"> & {
  memos: Partial<MemoType>[];
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type UserType = Omit<User, "createdAt" | "updatedAt"> & {
  memos: Partial<MemoType>[];
  votes: Partial<VoteType>[];
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type VoteType = Omit<Vote, "createdAt" | "updatedAt"> & {
  memo: Partial<MemoType>;
  user: Partial<UserType>;
  createdAt: Date | string;
  updatedAt: Date | string;
};
