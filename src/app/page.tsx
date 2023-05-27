import { getServerSession } from "next-auth";
import { authOptions } from "@/service/auth";
import { signIn } from "next-auth/react";
import { LoginButton } from "@/components/authButtons.component";

// #region styles

// const FrontPage = styled.div`
//   font-family: "Galmuri11";
//   text-align: center;
//   animation: ${appear} 2s;
// `;
// const Header = styled.header`
//   height: 50vh;
//   display: flex;
//   justify-content: center;
//   align-items: flex-end;
//   margin-bottom: 1em;
// `;
// const Title = styled.div`
//   font-size: 4rem;
//   ${unselectable}
// `;
// const TitleThe = styled.label`
//   font-size: 0.75em;
// `;
// const TitleWhiteboard = styled.label`
//   font-size: 1.25em;
//   font-weight: bold;
// `;
// const Content = styled.div`
//   background-color: #fefeff;
//   min-height: 50vh;
//   display: flex;
//   align-items: flex-start;
//   justify-content: center;
// `;

// #endregion

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log(session);

  return (
    <>
      <div id="front-page" className="font-galmuri text-center">
        <header className="h-[50vh]">
          <div>
            <label>{"The"}</label>
            <label>{"Whiteboard"}</label>
          </div>
        </header>
        <div>
          <LoginButton />
        </div>
      </div>
    </>
  );
}
