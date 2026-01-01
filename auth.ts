import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { API_BASE_URL } from "@/lib/constants"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          console.log(`[Auth] Checking backend for user: ${user.email}, API_BASE_URL: ${API_BASE_URL}`);
          const res = await fetch(`${API_BASE_URL}/auth/check`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              google_token: account.id_token,
            }),
          });
          console.log(`[Auth] Backend check response status: ${res.status}`);

          if (res.status === 404) {
            console.log(`[Auth] User not found in backend, allowing sign in to proceed`);
            return true; // Allow sign in so session is created, then handle redirect in middleware or page
          }

          if (res.status === 200) {
            return true; // Allow sign in
          }

          return false; // content with 500 or other errors
        } catch (error) {
          console.error(`[Auth] Error during signIn backend check:`, error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.id_token = account.id_token
      }

      // Fetch backend token if valid google token exists but backend token is missing
      if (token.id_token && !token.backendToken) {
        try {
          console.log(`[Auth] Fetching backend token in JWT`);
          const res = await fetch(`${API_BASE_URL}/auth/check`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              google_token: token.id_token,
            }),
          });

          if (res.status === 200) {
            const data = await res.json();
            console.log(`[Auth] Successfully retrieved backend token`);
            // Store backend token in JWT
            token.backendToken = data.token || data.data?.token;
            // Store profile data if available
            token.walimurid_profile = data.user?.walimurid_profile;
          }
        } catch (e) {
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user.id_token = token.id_token as string
      session.user.backendToken = token.backendToken as string
      session.user.walimurid_profile = token.walimurid_profile
      return session
    },
  },
})