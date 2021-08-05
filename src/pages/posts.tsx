import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Wrapper } from '../components/Wrapper';
import { gqlClient } from '../graphql/client';
import { GQL_MUTATION_DELETE_POST } from '../graphql/mutations/post';
import { GQL_QUERY_GET_POSTS } from '../graphql/queries/post';
import { frontEndRedirect } from '../utils/frontEndRedirect';
import { serverSideRedirect } from '../utils/serverSideRedirect';

export type StrapiPost = {
  id?: string;
  title: string;
  content: string;
};

export type PostsPageProps = {
  posts?: StrapiPost[];
};

export default function PostsPage({ posts = [] }: PostsPageProps) {
  const [session, loading] = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [statePosts, setStatePosts] = useState(posts);

  useEffect(() => {
    setStatePosts(posts);
  }, [posts]);

  if (!session && !loading) {
    return frontEndRedirect();
  }

  if (typeof window !== 'undefined' && loading) return null;

  if (!session) {
    return <p>Você não está autenticado</p>;
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await gqlClient.request(
        GQL_MUTATION_DELETE_POST,
        { id },
        {
          Authorization: `Bearer ${session.accessToken}`,
        },
      );

      setStatePosts((posts) => posts.filter((p) => p.id !== id));
    } catch (error) {
      alert('Não foi possível exlcuir este post');
    }
    setIsLoading(false);
  };

  return (
    <Wrapper>
      <h1>Olá {session?.user.name || 'visitante'}</h1>

      {statePosts.map((post) => (
        <p key={'post-' + post.id}>
          <Link href={`/${post.id}`}>
            <a>{post.title}</a>
          </Link>{' '}
          |{' '}
          <button disabled={isLoading} onClick={() => handleDelete(post.id)}>
            Excluir
          </button>
        </p>
      ))}
    </Wrapper>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return serverSideRedirect(ctx);
  }

  try {
    const { posts } = await gqlClient.request(GQL_QUERY_GET_POSTS, null, {
      Authorization: `Bearer ${session.accessToken}`,
    });
    console.log(posts);

    return {
      props: {
        session,
        posts,
      },
    };
  } catch (error) {
    return serverSideRedirect(ctx);
  }
};
