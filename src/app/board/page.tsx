import { LogoutButton } from "@/components/authButtons.component";
import { Board } from "@/components/board.component";
import { authOptions } from "@/service/auth";
import { getServerSession } from "next-auth";

export default async function BoardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <div
        id="board-header"
        className="flex justify-center border-b-2 border-gray-200 py-2"
      >
        <div id="board-title" className="text-3xl font-galmuri font-bold">
          world
        </div>
      </div>
      <div id="board-center">
        <Board></Board>
      </div>
      <div
        id="board-footer"
        className="fixed bottom-0 flex items-center justify-between w-full py-4 px-4 border-gray-200 border-t-2 font-galmuri font-bold"
      >
        <div className="w-24">
          <LogoutButton className="text-2xl hover:underline" />
        </div>
        <div className="text-3xl flex gap-2 leading-normal">
          <span>{`<`}</span>
          <span>1</span>
          <span>{`>`}</span>
        </div>
        <div className="w-24 shrink-0">{/* empty */}</div>
      </div>
    </div>
  );
}
