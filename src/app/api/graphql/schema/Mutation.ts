import gql from "graphql-tag";

export const Mutation = gql`
  type Mutation {
    userCreate(input: UserCreateInput): UserPayload
  }

  input UserCreateInput {
    nickname: String
  }

  type UserPayload {
    user: User
  }
`;
