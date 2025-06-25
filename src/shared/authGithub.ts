import { OAuthApp } from "@octokit/oauth-app";

export const oauth = new OAuthApp({
  clientType: "oauth-app",
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  defaultScopes: ["read:user", "user:email"]
})