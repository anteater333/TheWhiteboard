import { LogoutButton } from "@/components/authButtons.component";
import { Board } from "@/components/board.component";
import { AddButton, OnGoingMemoButton } from "@/components/buttons.component";
import { authOptions } from "@/service/auth";
import { getServerSession } from "next-auth";

export default async function BoardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex h-screen w-screen flex-col">
      <div
        id="board-header"
        className="flex justify-center border-b-2 border-gray-200 py-2"
      >
        <div id="board-title" className="font-galmuri text-3xl font-bold">
          world
        </div>
      </div>
      <div id="board-center" className="relative h-full w-full">
        <Board></Board>
        <div className="absolute bottom-8 right-8 w-fit">
          <AddButton />
        </div>
        <div className="absolute bottom-8 left-8 w-fit">
          <OnGoingMemoButton />
        </div>
      </div>
      <div
        id="board-footer"
        className="flex w-full items-center justify-between border-t-2 border-gray-200 px-4 py-4 font-galmuri font-bold"
      >
        <div className="w-24">
          <LogoutButton className="text-2xl hover:underline" />
        </div>
        <div className="flex gap-2 text-3xl leading-normal">
          <span>{`<`}</span>
          <span>1</span>
          <span>{`>`}</span>
        </div>
        <div className="w-24 shrink-0">{/* empty */}</div>
      </div>
    </div>
  );
}
