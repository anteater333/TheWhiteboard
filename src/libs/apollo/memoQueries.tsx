import { MemoType } from "@/types/types";
import { gql, useMutation } from "@apollo/client";

const NEW_MEMO = gql`
  mutation NewMemo($input: MemoCreateInput) {
    memoCreate(input: $input) {
      memo {
        id
      }
    }
  }
`;

interface INewMemoInput {
  boardName: string;
  pageNum: number;
  content: string | undefined;
  memoType: number | undefined;
  positionX: number;
  positionY: number;
  userId: number | null | undefined;
}

/** 새 메모 생성 GQL Mutation */
export const useNewMemoMutation = function (newMemo: INewMemoInput) {
  return useMutation(NEW_MEMO, {
    variables: {
      input: newMemo,
    },
  });
};
