import { Query } from "react-apollo";
import { GIF_SEARCH_QUERY, GifSearchResponseType } from "./gif";
import { GIFObject } from "./giphy-api";
import InfiniteScroll from "react-infinite-scroller";
import React from "react";

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
  limit = 25
}) => (
  <GifSearchQueryComponent
    query={GIF_SEARCH_QUERY}
    variables={{
      q,
      offset,
      limit
    }}
  >
    {({ data = { gifs: [] }, fetchMore }) => (
      <>
        <InfiniteScroll
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
          hasMore={true}
          loadMore={() => {
            console.log("!");
            return fetchMore({
              variables: {
                offset: (data.gifs || {}).length || 0
              },
              updateQuery: (prev, { fetchMoreResult }) => ({
                gifs: !fetchMoreResult
                  ? prev.gifs
                  : [...prev.gifs, ...fetchMoreResult.gifs]
              })
            });
          }}
        >
          {(data.gifs || []).map(g => (
            <img
              style={{ margin: "24px" }}
              src={g.images.fixed_height_small.url}
            />
          ))}
        </InfiniteScroll>
      </>
    )}
  </GifSearchQueryComponent>
);
