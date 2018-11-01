import gql from "graphql-tag";
import { ImageObject, GIFObject } from "./giphy-api";

const GIFFragment = gql`
  fragment GIFFragment on Gif {
    type
    id
    slug
    url
    bitly_gif_url
    bitly_url
    embed_url
    username
    source
    rating
    caption
    content_url
    source_tld
    source_post_url
    import_datetime
    trending_datetime
    images
    meta
  }
`;

export type GifSearchResponseType = {
  gifs: GIFObject[];
};
export const GIF_SEARCH_QUERY = gql`
  query GIFSearch($q: String!, $offset: Int, $limit: Int) {
    gifs(q: $q, offset: $offset, limit: $limit)
      @rest(type: "GIFObjects", path: "gifs/search?{args}") {
      type
      id
      slug
      url
      bitly_gif_url
      bitly_url
      embed_url
      username
      source
      rating
      caption
      content_url
      source_tld
      source_post_url
      import_datetime
      trending_datetime
      images
      meta
    }
  }
  ${GIFFragment}
`;
