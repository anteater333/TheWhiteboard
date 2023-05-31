import { LogoutButton } from "@/components/authButtons.component";
import Memo from "@/components/Memo";
import { authOptions } from "@/service/auth";
import { getServerSession } from "next-auth";

export default async function Board() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <Memo></Memo>
      <LogoutButton />
    </div>
  );
}
