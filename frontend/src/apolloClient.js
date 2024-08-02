import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

// Error handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Authentication link to add the token to the headers
const authLink = setContext(() => {
  const token = localStorage.getItem('token'); 
  console.log ("Token from localSt",localStorage.getItem('token'))// Retrieve the token from localStorage
  return {
    headers: {
      authorization: token ? `Bearer ${token}` : '', // Attach the token in the Authorization header
    },
  };
});

// HTTP link to communicate with GraphQL server
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

// Apollo Client setup
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;