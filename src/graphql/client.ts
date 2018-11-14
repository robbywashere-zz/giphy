import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { RestLink } from "apollo-link-rest";
import { ApolloLink } from "apollo-link";
import { withClientState } from "apollo-link-state";

const API_KEY = "PE0b68UA9uP5tc52x5IHhXvJUWsfriEV";

const restLink = new RestLink({
  uri: "https://api.giphy.com/v1/",
  customFetch: async (request, params) => {
    let url = new URL(request.toString());
    url.searchParams.append("api_key", API_KEY);
    return fetch(url.toString(), params);
  }
});

type toggleLikeType = (A: any, B: any, C: any) => any;
const cache = new InMemoryCache();
const stateLink = withClientState({
  cache,
  defaults: {
    status: {
      liked: false
    }
  },
  resolvers: {
    Mutation: {
      toggleLike: (_: any, { status }: any, { cache }: any) => {
        const data = {
          status: {
            __typename: "Status",
            liked: status.liked
          }
        };
        cache.writeData({ data });
        return null;
      }
    }
  }
});

export const client = () =>
  new ApolloClient({
    link: ApolloLink.from([stateLink, stateLink]),
    cache
  });
