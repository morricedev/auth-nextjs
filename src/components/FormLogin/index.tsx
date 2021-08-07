import React, { useState } from 'react';
import { Email } from '@styled-icons/material-outlined/Email';
import { Password } from '@styled-icons/material-outlined/Password';

import { TextInput } from '../TextInput';
import * as Styled from './styles';
import { Button } from '../Button';
import Link from 'next/link';

export type FormLoginProps = {
  errorMessage?: string;
  onLogin?: (email: string, password: string) => Promise<void>;
};

export const FormLogin = ({ errorMessage, onLogin }: FormLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    if (onLogin) {
      await onLogin(email, password);
    }

    setLoading(false);
  };

  return (
    <Styled.Wrapper onSubmit={handleSubmit}>
      <TextInput
        type="email"
        name="user-identifier"
        label="Seu e-mail"
        onInputChange={(v) => setEmail(v)}
        value={email}
        icon={<Email />}
        required
      />
      <TextInput
        type="password"
        name="user-password"
        label="Sua senha"
        onInputChange={(v) => setPassword(v)}
        value={password}
        icon={<Password />}
        required
      />

      <Link href="/signup">
        <a>Criar conta</a>
      </Link>

      <Link href="/forgot-password">
        <a>Esqueci minha senha</a>
      </Link>

      {!!errorMessage && (
        <Styled.ErrorMessage>{errorMessage}</Styled.ErrorMessage>
      )}

      <Styled.ButtonWrapper>
        <Button disabled={loading}>{loading ? 'Aguarde...' : 'Entrar'}</Button>
      </Styled.ButtonWrapper>
    </Styled.Wrapper>
  );
};
