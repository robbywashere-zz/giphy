import { Query, QueryResult } from "react-apollo";
import { GIF_SEARCH_QUERY } from "./graphql/queries";
import InfiniteScroll from "react-infinite-scroller";
import React from "react";

import { GIFObject, PaginationObject } from "./graphql/giphy-api";
import { withState, compose } from "recompose";
import { GIFList } from "./GIFList";

export interface MyGIFObject extends GIFObject {
  status: {
    liked: boolean;
  };
}

type GIFSearchResponseType = QueryResponseType<MyGIFObject[]>;

export type QueryResponseType<T> = {
  response: {
    data: T;
    pagination: PaginationObject;
  };
};

interface GIFSearchVariables {
  q?: string;
  offset?: number;
  limit?: number;
}
export class GIFSearchQueryComponent extends Query<
  GIFSearchResponseType,
  GIFSearchVariables
> {}

interface GIFSearchProps extends GIFSearchVariables {
  children: (
    props: QueryResult<GIFSearchResponseType, GIFSearchVariables>
  ) => React.ReactNode;
}

export const GIFSearchQuery: React.SFC<GIFSearchProps> = ({
  q = "trending",
  offset = 0,
  limit = 25,
  children
}) => (
  <GIFSearchQueryComponent
    query={GIF_SEARCH_QUERY}
    variables={{
      q,
      offset,
      limit
    }}
  >
    {props => children(props)}
  </GIFSearchQueryComponent>
);

export interface InfiniteScrollerProps<T> extends QueryResult<T> {
  children: (props: T) => React.ReactNode;
}

export interface InfiniteScrollerType<T = any[]>
  extends React.SFC<InfiniteScrollerProps<QueryResponseType<T>>> {}

export const InfiniteScroller: InfiniteScrollerType = ({
  data,
  fetchMore,
  children
}) => {
  if (!data || Object.entries(data).length === 0) return null;
  const { data: collection, pagination } = data.response;
  return (
    <>
      <InfiniteScroll
        loader={<div>Loading ...</div>}
        hasMore={collection.length < pagination.total_count}
        loadMore={() => {
          return fetchMore({
            variables: {
              offset: collection.length
            },
            updateQuery: (prev, { fetchMoreResult }) => ({
              ...prev,
              response: {
                ...prev.response,
                data: !fetchMoreResult
                  ? Array.from(new Set(collection))
                  : Array.from(
                      new Set([
                        ...prev.response.data,
                        ...fetchMoreResult.response.data
                      ])
                    )
              }
            })
          });
        }}
      >
        {children(data)}
      </InfiniteScroll>
    </>
  );
};

export const InfiniteGIFScroller = InfiniteScroller as InfiniteScrollerType<
  MyGIFObject[]
>;
type infStateProps = {
  getInput: string;
  setInput: (state: string) => string;
  getQuery: string;
  setQuery: (state: string) => string;
};

const InfiniteGIFSearchQueryComponent: React.SFC<infStateProps> = ({
  getInput,
  setInput,
  setQuery,
  getQuery
}) => (
  <>
    <form
      onSubmit={e => {
        e.preventDefault();
        setQuery(getInput);
      }}
    >
      <input
        type="text"
        onChange={e => setInput(e.target.value)}
        value={getInput}
      />
      <button type="submit">SEARCH</button>
    </form>
    <GIFSearchQuery q={getQuery}>
      {props => (
        <InfiniteGIFScroller {...props}>
          {({ response: { data: gifs } }) => <GIFList gifs={gifs} />}
        </InfiniteGIFScroller>
      )}
    </GIFSearchQuery>
  </>
);

export const InfiniteGIFSearchQuery = compose<infStateProps, React.SFC>(
  withState("getQuery", "setQuery", "trending"),
  withState("getInput", "setInput", "trending")
)(InfiniteGIFSearchQueryComponent);
