import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { NextRequest } from "next/server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLID },
    oauth_id: { type: GraphQLID },
    nickname: { type: GraphQLString },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
  },
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    user: {
      type: UserType,
      resolve: (_, args) => {
        return [
          {
            id: "id",
            oauth_id: "oauth_id",
            nickname: "nickname",
            created_at: "created_at",
            updated_at: "updated_at",
          },
        ];
      },
    },
  },
});

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

export async function GET(request: Request) {
  return handler(request);
}

export async function POST(request: Request) {
  return handler(request);
}
