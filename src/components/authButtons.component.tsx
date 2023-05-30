"use client";

import { signIn } from "next-auth/react";

export const LoginButton = () => {
  return (
    <button
      className="text-3xl font-bold mt-4 hover:underline"
      onClick={() => signIn("google")}
    >
      구글 로그인
    </button>
  );
};
