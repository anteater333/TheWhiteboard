import { getServerSession } from "next-auth";
import { authOptions } from "@/service/auth";
import { LoginButton } from "@/components/authButtons.component";

export default async function Home() {
  const session = await getServerSession(authOptions);

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
        <div>
          <LoginButton />
        </div>

        {!!session ? <div>{JSON.stringify(session)}</div> : undefined}
      </div>
    </>
  );
}
