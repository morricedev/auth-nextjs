import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { PrivateComponent } from '../components/PrivateComponent';
import { gqlClient } from '../graphql/client';
import { GQL_QUERY_GET_POST } from '../graphql/queries/post';
import { UpdatePostTemplate } from '../templates/UpdatePost';
import { serverSideRedirect } from '../utils/serverSideRedirect';
import { StrapiPost } from './posts';

export type PostPageProps = {
  post: StrapiPost;
};

export default function PostPage({ post }: PostPageProps) {
  return (
    <PrivateComponent>
      <UpdatePostTemplate post={post} />
    </PrivateComponent>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  const { id } = ctx.params;

  if (!session) {
    return serverSideRedirect(ctx);
  }

  try {
    const { post } = await gqlClient.request(
      GQL_QUERY_GET_POST,
      { id },
      {
        Authorization: `Bearer ${session.accessToken}`,
      },
    );
    console.log(post);

    return {
      props: {
        session,
        post,
      },
    };
  } catch (error) {
    return serverSideRedirect(ctx);
  }
};
