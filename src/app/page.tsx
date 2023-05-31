import { LoginButton, LogoutButton } from "@/components/authButtons.component";
import { authOptions } from "@/service/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // console.log(session);

  return (
    <>
      <div id="front-page" className="font-galmuri text-center">
        <header className="h-[50vh] flex justify-center items-end mb-4">
          <div className="flex justify-center">
            <span>
              <h1 className="select-none overflow-hidden border-r-[1rem] border-black my-0 mx-auto animate-type whitespace-nowrap">
                <span className="text-6xl tracking-wide">{"The"}</span>
                <span className="text-9xl font-bold">{"Whiteboard"}</span>
              </h1>
            </span>
          </div>
        </header>
        {!!session ? (
          <div className="flex flex-col justify-center">
            <Link
              className="text-3xl mt-2 font-bold hover:underline"
              href="/board"
            >
              게시판으로
            </Link>
            <LogoutButton />
          </div>
        ) : (
          <div>
            <LoginButton />
          </div>
        )}
      </div>
    </>
  );
}
