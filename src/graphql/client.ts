import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { RestLink } from "apollo-link-rest";
import { ApolloLink } from "apollo-link";

const API_KEY = "PE0b68UA9uP5tc52x5IHhXvJUWsfriEV";

const restLink = new RestLink({
  uri: "https://api.giphy.com/v1/",
  customFetch: async (request, params) => {
    let url = new URL(request.toString());
    url.searchParams.append("api_key", API_KEY);
    let response = await fetch(url.toString(), params).then(r => r.json());
    let { data, meta, pagination } = response;
    return new Response(new Blob([JSON.stringify(data)]), {
      status: meta.status
    });
  }
});

export const client = () =>
  new ApolloClient({
    link: ApolloLink.from([restLink]),
    cache: new InMemoryCache()
  });
