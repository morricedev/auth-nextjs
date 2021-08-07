import styled, { css } from 'styled-components';

export const Wrapper = styled.form`
  ${({ theme }) => css`
    a {
      display: inline-block;
      margin-bottom: ${theme.spacings.xhuge};
      margin-right: ${theme.spacings.small};
    }
  `}
`;

export const ButtonWrapper = styled.div``;

export const ErrorMessage = styled.p`
  ${({ theme }) => css`
    background: ${theme.colors.warning};
    color: ${theme.colors.white};
    padding: ${theme.spacings.xsmall} ${theme.spacings.small};
  `}
`;
