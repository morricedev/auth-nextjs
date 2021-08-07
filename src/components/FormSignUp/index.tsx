import React, { useState } from 'react';
import { Email } from '@styled-icons/material-outlined/Email';
import { Password } from '@styled-icons/material-outlined/Password';
import { Badge } from '@styled-icons/material-outlined/Badge';

import { TextInput } from '../TextInput';
import * as Styled from './styles';
import { Button } from '../Button';

export type FormSignUpProps = {
  errorMessage?: string;
  onSignUp?: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
};

export const FormSignUp = ({ errorMessage, onSignUp }: FormSignUpProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    if (onSignUp) {
      await onSignUp(username, email, password);
    }

    setLoading(false);
  };

  return (
    <Styled.Wrapper onSubmit={handleSubmit}>
      <TextInput
        type="text"
        name="user-username"
        label="Seu username"
        onInputChange={(v) => setUsername(v)}
        value={username}
        icon={<Badge />}
        required
      />
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

      {!!errorMessage && (
        <Styled.ErrorMessage>{errorMessage}</Styled.ErrorMessage>
      )}

      <Styled.ButtonWrapper>
        <Button disabled={loading}>
          {loading ? 'Aguarde...' : 'Registrar'}
        </Button>
      </Styled.ButtonWrapper>
    </Styled.Wrapper>
  );
};
