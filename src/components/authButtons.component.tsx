"use client";

import { signIn, signOut } from "next-auth/react";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type AuthButtonType = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const LoginButton = (props: AuthButtonType) => {
  return (
    <button
      {...props}
      onClick={() => signIn("google", { callbackUrl: "/board" })}
    >
      구글 로그인
    </button>
  );
};

export const LogoutButton = (props: AuthButtonType) => {
  return (
    <button
      {...props}
      onClick={() => signOut({ callbackUrl: "/api/auth/signout" })}
    >
      로그아웃
    </button>
  );
};
