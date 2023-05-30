"use client";

import { signIn, signOut } from "next-auth/react";

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

export const LogoutButton = () => {
  return (
    <button
      className="text-3xl font-bold mt-4 hover:underline"
      onClick={() => signOut()}
    >
      로그아웃
    </button>
  );
};
