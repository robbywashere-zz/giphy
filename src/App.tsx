import React from "react";
import { client } from "./graphql/client";
import { ApolloProvider } from "react-apollo";
import { InfiniteGIFSearchQuery } from "./GifSearchComponent";

const giphyClient = client();

export default () => (
  <ApolloProvider client={giphyClient}>
    <InfiniteGIFSearchQuery />
  </ApolloProvider>
);
