import gql from "graphql-tag";

export const Query = gql`
  type Query {
    user(id: ID!): User
  }
`;
