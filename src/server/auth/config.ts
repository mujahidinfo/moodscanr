import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq, and } from "drizzle-orm";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { db } from "~/server/db";
import {
	accounts,
	sessions,
	users,
	verificationTokens,
} from "~/server/db/schema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			// ...other properties
			// role: UserRole;
		} & DefaultSession["user"];
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
	providers: [
		GoogleProvider({
			clientId: process.env.AUTH_GOOGLE_ID,
			clientSecret: process.env.AUTH_GOOGLE_SECRET,
			authorization: {
				params: {
					scope: [
						"https://www.googleapis.com/auth/userinfo.email",
						"https://www.googleapis.com/auth/userinfo.profile",
						"https://www.googleapis.com/auth/youtube.readonly",
						"https://www.googleapis.com/auth/youtube.force-ssl"
					].join(" "),
					prompt: "consent",
					access_type: "offline",
					response_type: "code"
				}
			}
		})
	],
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens,
	}),
	callbacks: {
		async jwt({ token, account }) {
		  if (account) {
			 token.accessToken = account.access_token;
			 if (account.refresh_token) {
				token.refreshToken = account.refresh_token;
			 }
		  }
		  return token;
		},
		async session({ session, token }) {
		  // Ensure session.user.id is always a string
		  if (session?.user && token?.sub) {
			session.user.id = token.sub as string;
		  }

		  // Add accessToken and refreshToken to session, extending the type at runtime
		  if (token?.accessToken) {
			(session as any).accessToken = token.accessToken;
		  }
		  if (token?.refreshToken) {
			(session as any).refreshToken = token.refreshToken;
		  }

		  return session;
		}
		
	 },
	 events: {
		async signIn({ user, account }) {
			if (account?.refresh_token) {
			  // Update the DB to set refresh_token for this user/account
			  await db.update(accounts)
				 .set({ refresh_token: account.refresh_token })
				 .where(and(
					eq(accounts.userId, user.id!),
					eq(accounts.provider, account.provider),
				 ));
			}
		 }
	 }
} satisfies NextAuthConfig;
