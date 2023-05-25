export const resolvers = {
  Query: {
    user: async (parent: unknown, args: { id: number }) => {
      return { id: args.id };
    },
  },
  Mutation: {
    userCreate: async (
      parent: unknown,
      args: { input: { nickname: string } }
    ) => {
      console.log(args);
      return { user: { nickname: args.input.nickname } };
    },
  },
};
