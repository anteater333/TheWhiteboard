import gql from "graphql-tag";

const User = gql`
  type User {
    id: ID!
    oauthProvider: String
    nickname: String
    memos: [Memo]
    votes: [Vote]
    createdAt: String
    updatedAt: String
  }
`;

export { User };
