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
  //   // The maximum age of the NextAuth.js issued JWT in seconds.
  //   // Defaults to `session.maxAge`.
  //   // !!! 被覆盖了
  //   // next-auth/jwt/index.js
  //   //   const newToken = await jwt.encode({
  //   //   ...jwt,
  //   //   token,
  //   //   maxAge: options.session.maxAge
  //   // });
  //   // maxAge: ,
  // },
  // https://next-auth.js.org/configuration/options#session
  session: {
    // Seconds - How long until an idle session expires and is no longer valid.
    // 只要用户持续有操作（比如刷新页面、调用 useSession），session 的过期时间会不断被延长，始终保持在 maxAge 设定的时长内（滑动过期/sliding expiration）。
    // 只有在用户长时间没有任何操作，超过 maxAge，session 才会真正过期。
    maxAge: 3600,
    // Seconds - Throttle how frequently to write to database to extend a session. 避免频繁写数据库。
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens. 忽略 JWT。
    // updateAge: ,
  },
  // https://next-auth.js.org/configuration/options#callbacks
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    async jwt(params) {
      console.log("jwt callback called", Object.keys(params));
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
