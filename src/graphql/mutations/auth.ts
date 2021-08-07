import { gql } from 'graphql-request';
import { GQL_FRAGMENT_USER } from '../fragments/user';

export const GQL_MUTATION_AUTHENTICATE_USER = gql`
  ${GQL_FRAGMENT_USER}
  mutation AUTHENTICATE_USER($email: String!, $password: String!) {
    login(input: { identifier: $email, password: $password }) {
      jwt
      user {
        ...user
      }
    }
  }
`;

export const GQL_MUTATION_REGISTER_USER = gql`
  ${GQL_FRAGMENT_USER}
  mutation REGISTER_USER(
    $email: String!
    $username: String!
    $password: String!
  ) {
    register(
      input: { email: $email, username: $username, password: $password }
    ) {
      jwt
      user {
        ...user
      }
    }
  }
`;

export const GQL_MUTATION_FORGOT_PASSWORD = gql`
  mutation FORGOT_PASSWORD($email: String!) {
    forgotPassword(email: $email) {
      ok
    }
  }
`;

export const GQL_MUTATION_RESET_PASSWORD = gql`
  ${GQL_FRAGMENT_USER}
  mutation RESET_PASSWORD(
    $code: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      code: $code
      password: $password
      passwordConfirmation: $confirmPassword
    ) {
      jwt
      user {
        ...user
      }
    }
  }
`;
