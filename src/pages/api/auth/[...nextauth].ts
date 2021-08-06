import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { gqlClient } from '../../../graphql/client';
import { GQL_MUTATION_AUTHENTICATE_USER } from '../../../graphql/mutations/auth';

type NextAuthSession = {
  id: string;
  jwt: string;
  name: string;
  email: string;
  expiration: number;
};

type NextCredentials = {
  email: string;
  password: string;
};

export default NextAuth({
  jwt: {
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
  },
  secret: process.env.NEXT_AUTH_SECRET,
  session: {
    jwt: true,
    maxAge: 7 * 24 * 60 * 60,
  },
  providers: [
    Providers.Credentials({
      name: 'Credentials',

      credentials: {},
      async authorize(credentials: NextCredentials) {
        const { email, password } = credentials;
        if (!email || !password) return null;

        try {
          const { login } = await gqlClient.request(
            GQL_MUTATION_AUTHENTICATE_USER,
            {
              email,
              password,
            },
          );

          const { jwt, user } = login;
          const { id, username, email: userEmail } = user;

          if (!jwt || !id || !username || !userEmail) {
            return null;
          }

          // retorna o user
          return {
            jwt,
            id,
            name: username,
            email: userEmail,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async (token, user) => {
      // o user so é retornado quando logar
      const isSignIn = !!user;
      const currentDateInSeconds = Math.floor(Date.now() / 1000);
      const tokenExpirationInSeconds = Math.floor(7 * 24 * 60 * 60);

      if (isSignIn) {
        if (!user || !user.jwt || !user.name || !user.email || !user.id) {
          return Promise.resolve({});
        }

        token.jwt = user.jwt;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.expiration = Math.floor(
          currentDateInSeconds + tokenExpirationInSeconds,
        );
      } else {
        if (!token?.expiration) return Promise.resolve({});

        if (currentDateInSeconds > token.expiration) return Promise.resolve({});
      }

      // Passa o token para o próximo callback
      return Promise.resolve(token);
    },
    session: async (session, token: NextAuthSession) => {
      if (
        !token?.jwt ||
        !token?.name ||
        !token?.email ||
        !token?.id ||
        !token?.expiration
      ) {
        return null;
      }

      session.accessToken = token.jwt;
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
      };

      return { ...session };
    },
  },
});
