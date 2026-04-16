import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

// BACKEND_URL is used server-side (e.g. within Docker) where the public URL is unreachable.
// Falls back to NEXT_PUBLIC_API_BASE_URL for local dev.
const API_BASE = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') return false;

      try {
        const res = await fetch(`${API_BASE}/auth/google/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            google_id: account.providerAccountId,
            email: user.email,
            name: user.name ?? '',
          }),
        });

        if (!res.ok) return false;

        const { access, ...backendUser } = await res.json();
        // Attach backend user + JWT to the NextAuth user object for use in jwt callback
        user.backendUser = backendUser;
        user.backendToken = access;
        return true;
      } catch {
        return false;
      }
    },

    async jwt({ token, user }) {
      // On first sign-in, user is populated — persist backendUser and token
      if (user?.backendUser) {
        token.backendUser = user.backendUser;
        token.backendToken = user.backendToken;
      }
      return token;
    },

    async session({ session, token }) {
      // backendUser and backendToken accessible via useSession()
      if (token.backendUser) {
        session.backendUser = token.backendUser;
        session.backendToken = token.backendToken;
      }
      return session;
    },
  },
});
