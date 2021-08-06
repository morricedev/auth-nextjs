import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';
import { serverSideRedirect } from './serverSideRedirect';

export const privateServerSideProps = async <T>(
  ctx: GetServerSidePropsContext,
  callback: (session: Session) => Promise<T>,
) => {
  const session = await getSession(ctx);

  if (!session) {
    return serverSideRedirect(ctx);
  }

  const result = await callback(session);
  return result;
};
