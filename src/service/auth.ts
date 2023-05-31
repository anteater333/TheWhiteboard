import { generateRandomNickname } from "@/utils/generator";
import { Account, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbClient from "./database";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      checks: "none",
      authorization: {
        params: {
          // ! Google only provides Refresh Token to an application the first time a user signs in.
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    /** 로그인 시도 Hook */
    async signIn({ account, user, credentials, email, profile }) {
      if (!profile?.email) return false;
      const userEmail = profile.email;

      try {
        // 데이터베이스에 사용자 레코드가 없을 경우 새 사용자 생성
        const existingUser = await dbClient.user.findUnique({
          where: { email: userEmail },
        });

        // 존재하지 않는다면 새 사용자 레코드 생성
        if (!existingUser) {
          const now = new Date();
          await dbClient.user.create({
            data: {
              email: userEmail,
              nickname: generateRandomNickname(),
              provider: "google", // TODO :: 다양한 Provider 지원
              createdAt: now,
              updatedAt: now,
            },
          });
        }

        return true;
      } catch (error) {
        console.error(error);

        return false;
      }
    },
    /** 토큰 생성 Hook */
    async jwt({ token, account, user, profile, session, trigger }) {
      // 토큰에 Nickname 포함시키기
      const signedUser = await dbClient.user.findUnique({
        where: { email: token.email ?? undefined },
      });

      if (signedUser) {
        token.nickname = signedUser.nickname;
      }

      // Refresh Token Rotation
      if (account) {
        // Save the access token and refresh token in the JWT on the initial login
        return {
          ...token,
          access_token: account.access_token,
          expires_at: Math.floor(Date.now() / 1000 + (account.expires_in || 0)),
          refresh_token: account.refresh_token,
        };
      } else if (Date.now() < (token.expires_at || 0) * 1000) {
        // If the access token has not expired yet, return it
        return token;
      } else {
        // If the access token has expired, try to refresh it
        try {
          // https://accounts.google.com/.well-known/openid-configuration
          // We need the `token_endpoint`.
          const response = await fetch("https://oauth2.googleapis.com/token", {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID || "",
              client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
              grant_type: "refresh_token",
              refresh_token: token.refresh_token || "",
            }),
            method: "POST",
          });

          const tokens: Account = await response.json();

          if (!response.ok) throw tokens;

          return {
            ...token, // Keep the previous token properties
            access_token: tokens.access_token,
            expires_at: Math.floor(
              Date.now() / 1000 + (tokens.expires_in || 0)
            ),
            // Fall back to old refresh token, but note that
            // many providers may only allow using a refresh token once.
            refresh_token: tokens.refresh_token ?? token.refresh_token,
          };
        } catch (error) {
          console.error("Error refreshing access token", error);
          // The error property will be used client-side to handle the refresh token error
          return { ...token, error: "RefreshAccessTokenError" as const };
        }
      }
    },
    /** 세션 생성 Hook */
    async session({ newSession, session, token, trigger, user }) {
      session.error = token.error;
      session.access_token = token.access_token;
      session.user.nickname = token.nickname;
      return session;
    },
  },
};

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      nickname?: string | null;
    };
    error?: "RefreshAccessTokenError";
    access_token?: string;
  }
  interface Account {
    expires_in?: number;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    nickname?: string;
    access_token?: string;
    expires_at?: number;
    refresh_token?: string;
    error?: "RefreshAccessTokenError";
  }
}
