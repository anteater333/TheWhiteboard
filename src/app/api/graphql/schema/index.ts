import { User } from "./User";
import { Vote } from "./Vote";
import { Board } from "./Board";
import { Memo } from "./Memo";
import { Query } from "./Query";
import { Mutation } from "./Mutation";

const typeDefs = [Query, User, Board, Memo, Vote, Mutation];

export { typeDefs };
