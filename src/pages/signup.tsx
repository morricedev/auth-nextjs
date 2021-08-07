import { signIn } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import { FormSignUp } from '../components/FormSignUp';
import { Wrapper } from '../components/Wrapper';
import { gqlClient } from '../graphql/client';
import { GQL_MUTATION_REGISTER_USER } from '../graphql/mutations/auth';

export default function SignUp() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (
    username: string,
    email: string,
    password: string,
  ) => {
    const redirect = router.query?.redirect || '/';

    if (!username || !email || !password) {
      setError('Preencha os campos corretamente.');
      return Promise.resolve();
    }

    try {
      await gqlClient.request(GQL_MUTATION_REGISTER_USER, {
        username,
        email,
        password,
      });

      const response = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: redirect as string,
      });

      window.location.href = response.url;
    } catch (error) {
      if (error.response.errors[0].message === 'Bad Request') {
        setError('Email/Username em uso');
      } else {
        setError('Ocorreu um erro ao cadastrar, tente novamente mais tarde.');
      }
    }
  };
  return (
    <Wrapper>
      <FormSignUp onSignUp={handleSignUp} errorMessage={error} />
    </Wrapper>
  );
}
