import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { API_BASE_URL } from "@/lib/constants"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/check`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              google_token: account.id_token,
            }),
          });

          if (res.status === 404) {
            return "/register"; // Redirect to register page
          }

          if (res.status === 200) {
            return true; // Allow sign in
          }

          return false; // content with 500 or other errors
        } catch (error) {
          console.error("SignIn error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.id_token = account.id_token

        // Fetch backend token here on initial sign in
        try {
          const res = await fetch(`${API_BASE_URL}/auth/check`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              google_token: account.id_token,
            }),
          });

          if (res.status === 200) {
            const data = await res.json();
            // Store backend token in JWT
            token.backendToken = data.token || data.data?.token;
          }
        } catch (e) {
          console.error("Error fetching backend token in JWT callback", e);
        }
      }
      return token
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user.id_token = token.id_token
      // @ts-ignore
      session.user.backendToken = token.backendToken
      return session
    },
  },
})