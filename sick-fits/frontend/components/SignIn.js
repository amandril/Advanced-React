import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import Error from './ErrorMessage';
import Form from './styles/Form';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          email
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

export default function SignIn() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
  });
  const [signin, { data, loading }] = useMutation(SIGNIN_MUTATION, {
    variables: inputs,
    // refetch the currently logged in user
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  async function handleSubmit(e) {
    e.preventDefault(); // stop the form from submitting
    // console.log(inputs);
    const res = await signin();
    // console.log(res);
    // Send the email and password to the graphqlAPI

    resetForm();
  }
  const error =
    data?.authenticateUserWithPassword.__typename ===
    'UserAuthenticationWithPasswordFailure'
      ? data?.authenticateUserWithPassword
      : undefined;
  console.log(error);
  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Sign Into Your Account</h2>
      <Error error={error} />
      <fieldset>
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
            // onChange
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
            // value
            // onChange
          />
        </label>
        <button type="submit">Sign In!</button>
      </fieldset>
    </Form>
  );
}
