import GithubProvider from "next-auth/providers/github";
import GitLabProvider from "next-auth/providers/gitlab";
import GoogleProvider from "next-auth/providers/google";
import BattleNetProvider from "next-auth/providers/battlenet";

import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { credentialsProvider } from "./auth/credentialsProvider";

// const agent = new HttpProxyAgent(process.env.HTTP_PROXY!);

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const authOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      httpOptions: {
        timeout: 10_000,
      },
    }),
    GitLabProvider({
      clientId: process.env.GITLAB_ID!,
      clientSecret: process.env.GITLAB_SECRET!,
      httpOptions: {
        timeout: 10_000,
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      httpOptions: {
        timeout: 10_000,
        // agent, // need TUN proxy mode
      },
    }),
    BattleNetProvider({
      clientId: process.env.BATTLENET_CLIENT_ID!,
      clientSecret: process.env.BATTLENET_CLIENT_SECRET!,
      idToken: true,
      checks: ["nonce", "state"], // Use both nonce and state
      issuer: "https://us.battle.net/oauth",
    }),
    credentialsProvider,
  ],
  // https://next-auth.js.org/configuration/options#jwt
  // jwt: {
  //   maxAge: , // 如果 updateAge 触发，NextAuth 会尝试刷新 JWT（重新生成 token）
  // },
  // https://next-auth.js.org/configuration/options#session
  session: {
    maxAge: 36_000, // 如果用户 maxAge 秒内没有任何请求，Cookie 就失效，Session 会过期。控制 用户是否被认为已登录。
    // updateAge: , // 每次请求，如果距离上次刷新超过 updateAge 秒，就刷新一次 JWT & Cookie。
  },
  // https://next-auth.js.org/configuration/options#callbacks
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    async jwt(params) {
      // console.log("jwt callback called", params);
      if (params.account) {
        params.token.provider = params.account.provider;
        // preserve access_token, refresh_token in for further use
      }
      if (params.user) {
        return { id: params.user.id, ...params.token }; // save user id to token
      }
      return params.token;
    },
    async session(params) {
      // console.log("session callback called", params);
      if (params.session.user) {
        (params.session.user as any)["id"] = params.token.id;
        (params.session.user as any)["provider"] = params.token.provider;
      }
      return params.session;
    },
  },
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
  ...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []
) {
  return getServerSession(...args, authOptions);
}
