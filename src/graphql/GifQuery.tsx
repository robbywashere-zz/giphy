import { Query, QueryResult } from "react-apollo";
import { GIF_SEARCH_QUERY } from "./gif";
import InfiniteScroll from "react-infinite-scroller";
import React from "react";

import { GIFObject, PaginationObject, MetaObject } from "./giphy-api";
export type GifSearchResponseType = {
  response: {
    data: GIFObject[];
    pagination: PaginationObject;
  };
};

interface GifSearchVariables {
  q?: string;
  offset?: number;
  limit?: number;
}
export class GifSearchQueryComponent extends Query<
  GifSearchResponseType,
  GifSearchVariables
> {}

export const InfiniteGifSearchQuery: React.SFC<GifSearchVariables> = ({
  q = "trending",
  offset = 0,
  limit = 25,
  children
}) => (
  <GifSearchQueryComponent
    query={GIF_SEARCH_QUERY}
    variables={{
      q,
      offset,
      limit
    }}
  >
    {props => InfiniteScroller(props)}
  </GifSearchQueryComponent>
);

const InfiniteScroller: React.SFC<
  QueryResult<GifSearchResponseType, GifSearchVariables>
> = ({ data, fetchMore }) => {
  if (!data || Object.entries(data).length === 0) {
    return null;
  }
  const { data: gifs, pagination } = data.response;
  return (
    <>
      <InfiniteScroll
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
        hasMore={gifs.length < pagination.total_count}
        loadMore={() => {
          return fetchMore({
            variables: {
              offset: gifs.length
            },
            updateQuery: (prev, { fetchMoreResult }) => ({
              ...prev,
              response: {
                ...prev.response,
                data: !fetchMoreResult
                  ? [...gifs]
                  : [...prev.response.data, ...fetchMoreResult.response.data]
              }
            })
          });
        }}
      >
        {gifs.map(g => (
          <img
            key={g.id}
            style={{ margin: "24px" }}
            src={g.images.fixed_height_small_still.url}
          />
        ))}
      </InfiniteScroll>
    </>
  );
};
