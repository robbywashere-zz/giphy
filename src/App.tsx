import React, { Component } from "react";
import { client } from "./graphql/client";
import { ApolloProvider } from "react-apollo";
import { GifSearch } from "./GifSearch";
import { InfiniteGifSearchQuery } from "./graphql/GifQuery";

const giphyClient = client();

export default () => (
  <ApolloProvider client={giphyClient}>
    <InfiniteGifSearchQuery q="trending" />
  </ApolloProvider>
);
