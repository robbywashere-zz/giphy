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

const cache = new InMemoryCache({
  //dataIdFromObject: object => object.id || null
});

const stateLink = withClientState({
  cache,
  resolvers: {
    Mutation: {
      setLike: (parent: any, { liked, id }: any, { cache }: any) => {
        const data = {
          status: {
            liked,
            __typename: "Status"
          }
        };
        cache.writeData({ data, id: `GifObject:${id}` });
        return { id, liked };
      }
    }
  },
  defaults: {
    status: {
      liked: false,
      __typename: "Status"
    }
  }
});

export const client = () =>
  new ApolloClient({
    connectToDevTools: true,
    link: ApolloLink.from([stateLink, restLink]),
    cache
  });
