import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api';

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

        const backendUser = await res.json();
        // Attach backend user to the NextAuth user object for use in jwt callback
        user.backendUser = backendUser;
        return true;
      } catch {
        return false;
      }
    },

    async jwt({ token, user }) {
      // On first sign-in, user is populated — persist backendUser into the token
      if (user?.backendUser) {
        token.backendUser = user.backendUser;
      }
      return token;
    },

    async session({ session, token }) {
      // backendUser accessible via useSession()
      if (token.backendUser) {
        session.backendUser = token.backendUser;
      }
      return session;
    },
  },
});
