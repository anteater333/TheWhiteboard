import db from "@/service/database";
import { error } from "console";
import { GraphQLError } from "graphql";

const memoResolvers = {
  Query: {
    memo: async (
      parent: unknown,
      args: { boardName: string; pageNum: number }
    ) => {
      const board = await db.board.findFirst({
        where: { name: args.boardName },
        select: {
          id: true,
          pageCount: true,
          name: true,
        },
      });

      if (!board) {
        // Not found
        throw new GraphQLError("board name not found", {
          extensions: {
            code: "BOARD_NOT_FOUND",
          },
        });
      }

      if (board.pageCount < args.pageNum) {
        throw new GraphQLError("inavlid page number", {
          extensions: {
            code: "INVALID_PAGE_NUMBER",
          },
        });
      }

      return await db.memo.findMany({
        where: { boardId: board.id, pageNum: args.pageNum },
        select: {
          boardId: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          id: true,
          memoType: true,
          pageNum: true,
          positionX: true,
          positionY: true,
          point: true,
          votes: { select: { id: true, isUp: true } },
          user: {
            select: {
              id: true,
              nickname: true,
            },
          },
          referencedMemo: { select: { id: true } },
        },
      });
    },
  },
  Mutation: {
    memoCreate: async (
      parent: unknown,
      args: {
        input: {
          userId: string;
          boardName: string;
          memoType: number;
          content: string;
          pageNum: number;
          positionX: number;
          positionY: number;
        };
      }
    ) => {
      const user = await db.user.findFirst({
        where: { id: +args.input.userId },
      });

      if (!user) {
        // Not found
        throw new GraphQLError("user id not found", {
          extensions: {
            code: "USER_NOT_FOUND",
          },
        });
      }

      const board = await db.board.findFirst({
        where: { name: args.input.boardName },
      });

      if (!board) {
        // Not found
        throw new GraphQLError("board name not found", {
          extensions: {
            code: "BOARD_NOT_FOUND",
          },
        });
      }

      const now = new Date();

      try {
        const newMemo = await db.memo.create({
          data: {
            content: args.input.content,
            memoType: args.input.memoType,
            pageNum: args.input.pageNum,
            positionX: args.input.positionX,
            positionY: args.input.positionY,
            boardId: board.id,
            userId: user.id,
            point: 0,
            createdAt: now,
            updatedAt: now,
          },
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return { memo: newMemo };
      } catch (error) {
        throw error;
      }
    },
  },
};

export const resolvers = {
  Query: {
    user: async (parent: unknown, args: { id: string }) => {
      const user = await db.user.findFirst({
        where: { id: +args.id },
      });
      return user;
    },
    ...memoResolvers.Query,
  },
  Mutation: {
    userCreate: async (
      parent: unknown,
      args: { input: { nickname: string; email: string } }
    ) => {
      const now = new Date();

      return {
        user: await db.user.create({
          data: {
            provider: "Google",
            nickname: args.input.nickname,
            email: args.input.email,
            createdAt: now,
            updatedAt: now,
          },
        }),
      };
    },
    ...memoResolvers.Mutation,
  },
};
