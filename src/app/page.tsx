import { LoginButton, LogoutButton } from "@/components/authButtons.component";
import { authOptions } from "@/service/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div id="front-page" className="text-center font-galmuri">
        <header className="mb-4 flex h-[50vh] items-end justify-center">
          <div className="flex justify-center">
            <span>
              <h1 className="mx-auto my-0 animate-type select-none overflow-hidden whitespace-nowrap border-r-[1rem] border-black">
                <span className="text-6xl tracking-wide">{"The"}</span>
                <span className="text-9xl font-bold">{"Whiteboard"}</span>
              </h1>
            </span>
          </div>
        </header>
        {!!session ? (
          <div className="flex flex-col items-center justify-center">
            <Link
              className="mt-2 text-3xl font-bold hover:underline"
              href="/board"
            >
              게시판으로
            </Link>
            <LogoutButton className="mt-4 text-2xl hover:underline" />
          </div>
        ) : (
          <div>
            <LoginButton className="mt-4 text-3xl font-bold hover:underline" />
          </div>
        )}
      </div>
    </>
  );
}
