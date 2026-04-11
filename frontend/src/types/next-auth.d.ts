import 'next-auth';
import 'next-auth/jwt';

interface BackendUser {
  id: number;
  google_id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  date_joined: string;
}

declare module 'next-auth' {
  interface Session {
    backendUser: BackendUser;
    backendToken?: string;
  }
  interface User {
    backendUser?: BackendUser;
    backendToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    backendUser?: BackendUser;
    backendToken?: string;
  }
}
