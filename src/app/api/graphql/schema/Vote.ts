import gql from "graphql-tag";

const Vote = gql`
  type Vote {
    id: ID!
    memo: Memo
    user: User
    isUp: Boolean
    createdAt: String
    updatedAt: String
  }
`;

export { Vote };
