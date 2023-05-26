import dbClient from "@/service/database";

export const resolvers = {
  Query: {
    user: async (parent: unknown, args: { id: string }) => {
      return await dbClient.user.findFirst({
        where: { id: parseInt(args.id) },
      });
    },
  },
  Mutation: {
    userCreate: async (
      parent: unknown,
      args: { input: { nickname: string } }
    ) => {
      const now = new Date();

      return {
        user: await dbClient.user.create({
          data: {
            oauthProvider: "Google",
            nickname: args.input.nickname,
            createdAt: now,
            updatedAt: now,
          },
        }),
      };
    },
  },
};
