import React, { useEffect, useState } from 'react';
import { Email } from '@styled-icons/material-outlined/Email';
import { VpnKey } from '@styled-icons/material-outlined/VpnKey';
import { Password } from '@styled-icons/material-outlined/Password';

import { TextInput } from '../TextInput';
import * as Styled from './styles';
import { Button } from '../Button';

export type FormForgotPasswordProps = {
  errorMessage?: string;
  onForgotPassword?: (
    forgotCode: string,
    password: string,
    confirmPassword: string,
    email: string,
    keyMode: boolean,
  ) => Promise<void>;
};

export const FormForgotPassword = ({
  errorMessage,
  onForgotPassword,
}: FormForgotPasswordProps) => {
  const [keyMode, setKeyMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(errorMessage);

  useEffect(() => {
    setError('');
  }, [keyMode]);

  useEffect(() => {
    setError(errorMessage);
  }, [errorMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    if (onForgotPassword) {
      await onForgotPassword(
        forgotCode,
        password,
        confirmPassword,
        email,
        keyMode,
      );
    }

    setLoading(false);
  };

  return (
    <Styled.Wrapper onSubmit={handleSubmit}>
      {keyMode ? (
        <>
          <TextInput
            type="text"
            name="user-forgot-code"
            label="Chave de recuperação"
            onInputChange={(v) => setForgotCode(v)}
            value={forgotCode}
            icon={<VpnKey />}
            required
          />
          <TextInput
            type="password"
            name="user-password"
            label="Nova senha"
            onInputChange={(v) => setPassword(v)}
            value={password}
            icon={<Password />}
            required
          />
          <TextInput
            type="password"
            name="user-confirm-password"
            label="Confirme nova senha"
            onInputChange={(v) => setConfirmPassword(v)}
            value={confirmPassword}
            icon={<Password />}
            required
          />
        </>
      ) : (
        <TextInput
          type="email"
          name="user-identifier"
          label="Seu e-mail"
          onInputChange={(v) => setEmail(v)}
          value={email}
          icon={<Email />}
          required
        />
      )}

      {!!error && <Styled.ErrorMessage>{error}</Styled.ErrorMessage>}

      <a href="#" onClick={() => setKeyMode(!keyMode)}>
        {keyMode ? 'Inserir e-mail' : 'Inserir Chave'}
      </a>

      <Styled.ButtonWrapper>
        <Button type="submit" disabled={loading}>
          {loading ? 'Aguarde...' : 'Recuperar'}
        </Button>
      </Styled.ButtonWrapper>
    </Styled.Wrapper>
  );
};
