import gql from "graphql-tag";
const GIFFragment = gql`
  fragment GIFFragment on GifObject {
    status @client {
      liked
    }
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
  }
`;

export const LIKE_GIF_QUERY = gql`
  mutation setLike($liked: Boolean!, $id: String) {
    setLike(liked: $liked, id: $id) @client
  }
`;

export const GIF_SEARCH_QUERY = gql`
  query GIFSearch($q: String!, $offset: Int, $limit: Int) {
    response(q: $q, offset: $offset, limit: $limit)
      @rest(type: "GIFObjectPayload", path: "gifs/search?{args}") {
      pagination @type(name: "Pagination") {
        total_count
        offset
        count
      }
      data @type(name: "GifObject") {
        ...GIFFragment
      }
    }
  }
  ${GIFFragment}
`;
