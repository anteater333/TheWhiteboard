import { authOptions } from "@/service/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  console.log(session);
  return NextResponse.json({
    hello: `world. This is ${Date.now()}`,
    token: session,
  });
}
