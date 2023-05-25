import gql from "graphql-tag";

const User = gql`
  type User {
    id: ID!
    ouathId: ID
    nickname: String
    memos: [Memo]
    votes: [Vote]
    createdAt: String
    updatedAt: String
  }
`;

export { User };
