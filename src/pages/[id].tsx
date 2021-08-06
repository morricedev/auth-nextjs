import { GetServerSideProps } from 'next';
import { PrivateComponent } from '../components/PrivateComponent';
import { gqlClient } from '../graphql/client';
import { GQL_QUERY_GET_POST } from '../graphql/queries/post';
import { UpdatePostTemplate } from '../templates/UpdatePost';
import { privateServerSideProps } from '../utils/privateServerSideProps';
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
  return await privateServerSideProps(ctx, async (session) => {
    const { id } = ctx.params;

    try {
      const { post } = await gqlClient.request(
        GQL_QUERY_GET_POST,
        { id },
        {
          Authorization: `Bearer ${session.accessToken}`,
        },
      );

      return {
        props: {
          session,
          post,
        },
      };
    } catch (error) {
      return {
        props: {
          session,
        },
      };
    }
  });
};
