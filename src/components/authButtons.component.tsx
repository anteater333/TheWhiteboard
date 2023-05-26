"use client";

import { signIn } from "next-auth/react";

export const LoginButton = () => {
  return (
    <button onClick={() => signIn()} style={{ backgroundColor: "#56ff67" }}>
      Sign In
    </button>
  );
};
