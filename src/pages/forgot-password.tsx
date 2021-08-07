import { useState } from 'react';
import { FormForgotPassword } from '../components/FormForgotPassword';
import { Wrapper } from '../components/Wrapper';
import { gqlClient } from '../graphql/client';
import {
  GQL_MUTATION_FORGOT_PASSWORD,
  GQL_MUTATION_RESET_PASSWORD,
} from '../graphql/mutations/auth';

export default function ForgotPassword() {
  const [error, setError] = useState('');

  const handleForgotPassword = async (
    forgotCode: string,
    password: string,
    confirmPassword: string,
    email: string,
    keyMode: boolean,
  ) => {
    if (keyMode) {
      try {
        if (!forgotCode || !password || !confirmPassword) {
          setError('Preencha os campos corretamente.');
          return Promise.resolve();
        }

        if (password !== confirmPassword) {
          setError('As senhas não conferem.');
          return Promise.resolve();
        }

        await gqlClient.request(GQL_MUTATION_RESET_PASSWORD, {
          code: forgotCode,
          password,
          confirmPassword,
        });
        window.alert(`Senha alterada com sucesso!`);
        window.location.href = '/login';
      } catch (error) {
        if (error.response.errors[0].message === 'Bad Request') {
          setError('Chave inválida');
        } else {
          setError('Ocorreu um erro ao alterar a senha');
        }
      }
    } else {
      try {
        if (!email) {
          setError('Insira um e-mail válido.');
          return Promise.resolve();
        }

        await gqlClient.request(GQL_MUTATION_FORGOT_PASSWORD, { email });
        window.alert(`Chave enviada para o email ${email}`);
      } catch (error) {
        if (error.response.errors[0].message === 'Bad Request') {
          setError('Email não encontrado');
        } else {
          setError('Ocorreu um erro ao enviar chave de recuperação');
        }
      }
    }
  };
  return (
    <Wrapper>
      <FormForgotPassword
        errorMessage={error}
        onForgotPassword={handleForgotPassword}
      />
    </Wrapper>
  );
}
