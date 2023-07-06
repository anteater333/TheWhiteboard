import { LogoutButton } from "@/components/authButtons.component";
import { Board } from "@/components/board.component";
import { AddButton, OnGoingMemoButton } from "@/components/buttons.component";
import { authOptions } from "@/service/auth";
import { getServerSession } from "next-auth";

export default async function BoardPage({
  params,
  searchParams,
}: {
  params: { name: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);

  const pageNum = searchParams["page"] ?? 1;

  return (
    <div className="flex h-screen w-screen flex-col overflow-x-hidden overflow-y-scroll scrollbar-hide">
      <div
        id="board-header"
        className="z-10 flex h-14 justify-center border-b-2 border-gray-200 bg-stone-100 py-2"
      >
        <div id="board-title" className="font-galmuri text-3xl font-bold">
          {params.name}
        </div>
      </div>
      <div
        id="board-center"
        className="relative h-[90vh] w-full overflow-hidden"
      >
        {/* The Whiteboard */}
        <Board />
      </div>
      <div
        id="board-footer"
        className="fixed bottom-0 z-10 flex h-14 w-full items-center border-t-2 border-gray-200 bg-stone-100 px-8 py-1 font-galmuri font-bold"
      >
        <div className="flex flex-1 justify-center">
          <LogoutButton className="mr-auto text-2xl hover:underline" />
        </div>
        <div className="flex flex-1 justify-center gap-2 text-3xl leading-normal">
          <span>{`<`}</span>
          <span>{pageNum}</span>
          <span>{`>`}</span>
        </div>
        <div className="flex flex-1 justify-center overflow-visible">
          <span className="ml-auto whitespace-nowrap text-right text-xl hover:underline">
            {session?.user.nickname}
          </span>
        </div>
      </div>
    </div>
  );
}
