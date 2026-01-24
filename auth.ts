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
            // User not found in backend
            return "/?error=EmailTidakTerdaftar";
          }



          if (res.status === 200) {
            return true; // Allow sign in
          }

          return false; // content with 500 or other errors
        } catch (error) {

          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, trigger, session }) {
      if (account) {
        token.id_token = account.id_token
      }

      // Fetch backend token if valid google token exists but backend token is missing OR if triggered by session update
      if ((token.id_token && !token.backendToken) || trigger === "update") {
        try {

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

            // Store backend token in JWT
            token.backendToken = data.token || data.data?.token;
            // Store profile data if available
            token.walimurid_profile = data.user?.walimurid_profile;
            // Store registration status
            token.is_registered = data.is_registered;
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
      session.user.is_registered = token.is_registered
      return session
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  }
})