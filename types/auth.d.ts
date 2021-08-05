import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    jwt: string;
    name: string;
    email: string;
    expiration?: number;
  }

  interface Session {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }
}
