import gql from "graphql-tag";

const Board = gql`
  type Board {
    id: ID!
    memos: [Memo]
    name: String
    description: String
    pageCount: Int
    createdAt: String
    updatedAt: String
  }
`;

export { Board };
