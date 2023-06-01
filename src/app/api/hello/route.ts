import { authOptions } from "@/service/auth";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const token = await getToken({ req });

  if (!session) {
    return NextResponse.json({ message: "Login guard test" }, { status: 401 });
  }

  return NextResponse.json({
    hello: `${session.user.nickname}`,
    token: token,
  });
}
