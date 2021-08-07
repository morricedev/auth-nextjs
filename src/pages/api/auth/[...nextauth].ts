/* eslint-disable @typescript-eslint/no-explicit-any */
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

const currentDateInSeconds = Math.floor(Date.now() / 1000);
const tokenExpirationInSeconds = Math.floor(7 * 24 * 60 * 60);

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

          // retorna o user
          return login;
        } catch (error) {
          return null;
        }
      },
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    jwt: async (token, user, account) => {
      // o user so é retornado quando logar
      const isSignIn = !!user;

      if (isSignIn) {
        if (account && account.provider === 'google') {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback?access_token=${account.accessToken}`,
          );
          const data = await response.json();
          token = setToken(data);

          return Promise.resolve(token);
        } else {
          token = setToken(user);
          return Promise.resolve(token);
        }
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
    async redirect(url, baseUrl) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith('/')) return baseUrl + url;
      return baseUrl;
    },
  },
});

const setToken = (data: any) => {
  if (!data || !data?.user || !data?.jwt) return {};

  return {
    jwt: data.jwt,
    id: data.user.id,
    name: data.user.username,
    email: data.user.email,
    expiration: Math.floor(currentDateInSeconds + tokenExpirationInSeconds),
  };
};
