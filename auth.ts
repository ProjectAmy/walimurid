import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { API_BASE_URL } from "@/lib/constants"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {

          console.log("[Auth] Checking backend at:", `${API_BASE_URL}/auth/check`);
          const res = await fetch(`${API_BASE_URL}/auth/check`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              google_token: account.id_token,
            }),
          });

          console.log("[Auth] Backend response status:", res.status);

          if (res.status === 404) {
            console.log("[Auth] User not found (404)");
            // User not found in backend
            return "/?error=EmailTidakTerdaftar";
          }

          if (res.status === 200) {
            console.log("[Auth] Sign in successful (200)");
            return true;
          }

          if (res.status === 401) {
            const errorData = await res.json();
            console.error("[Auth] Backend 401 Unauthorized. Error details:", errorData);
            return false;
          }

          console.log("[Auth] Sign in denied. Status:", res.status);
          return false;
        } catch (error) {
          console.error("[Auth] Sign in error:", error);
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
          console.log("[Auth] Fetching backend token in JWT callback");
          const res = await fetch(`${API_BASE_URL}/auth/check`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              google_token: token.id_token,
            }),
          });

          console.log("[Auth] JWT backend check status:", res.status);

          if (res.status === 200) {
            const data = await res.json();
            console.log("[Auth] JWT received data for user:", data.user?.email);

            // Store backend token in JWT
            token.backendToken = data.token || data.data?.token;
            // Store profile data if available
            token.walimurid_profile = data.user?.walimurid_profile;
            // Store registration status
            token.is_registered = data.is_registered;
          }
        } catch (e) {
          console.error("[Auth] JWT error:", e);
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