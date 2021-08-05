import { useSession } from 'next-auth/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { gqlClient } from '../../graphql/client';
import { GQL_MUTATION_DELETE_POST } from '../../graphql/mutations/post';
import { Wrapper } from '../../components/Wrapper';
import { StrapiPost } from '../../pages/posts';

export type PostsTemplateProps = {
  posts?: StrapiPost[];
};

export function PostsTemplate({ posts = [] }: PostsTemplateProps) {
  const [session] = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [statePosts, setStatePosts] = useState(posts);

  useEffect(() => {
    setStatePosts(posts);
  }, [posts]);

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
