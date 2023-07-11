import gql from "graphql-tag";

export const Mutation = gql`
  type Mutation {
    userCreate(input: UserCreateInput): UserPayload
    memoCreate(input: MemoCreateInput): MemoPayload
  }

  input UserCreateInput {
    nickname: String
    email: String
  }

  type UserPayload {
    user: User
  }

  input MemoCreateInput {
    userId: ID
    boardName: String
    memoType: Int
    content: String
    pageNum: Int
    positionX: Int
    positionY: Int
  }

  type MemoPayload {
    memo: Memo
  }
`;
