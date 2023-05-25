import gql from "graphql-tag";
import { User } from "./User";
import { Vote } from "./Vote";
import { Board } from "./Board";
import { Memo } from "./Memo";

const Query = gql`
  type Query {
    user(id: ID!): User
  }
`;

const Mutation = gql`
  type Mutation {
    userCreate(input: UserCreateInput): UserPayload
  }
`;

const Inputs = gql`
  input UserCreateInput {
    nickname: String
  }
`;

const Payloads = gql`
  type UserPayload {
    user: User
  }
`;

const typeDefs = [Query, User, Board, Memo, Vote, Mutation, Inputs, Payloads];

export { typeDefs };
