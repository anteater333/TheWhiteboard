import gql from "graphql-tag";

const Memo = gql`
  type Memo {
    id: ID!
    user: User
    board: Board
    referencingMemo: Memo
    referencedMemo: [Memo]
    memoType: Int
    title: String @deprecated
    content: String
    imageUrlFirst: String
    imageUrlSecond: String
    isWriting: Boolean
    pageNum: Int
    positionX: Int
    positionY: Int
    votes: [Vote]
    createdAt: String
    updatedAt: String
  }
`;

export { Memo };
