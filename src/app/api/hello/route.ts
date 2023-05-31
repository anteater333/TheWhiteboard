import { authOptions } from "@/service/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Login guard test" }, { status: 401 });
  }

  return NextResponse.json({
    hello: `${session.user.nickname}`,
  });
}
