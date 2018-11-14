import React from "react";
import { Mutation } from "react-apollo";
import { LIKE_GIF_QUERY } from "./graphql/queries";
import { MyGIFObject } from "./GifSearchComponent";

export const GIFList: React.SFC<{
  gifs: MyGIFObject[];
}> = ({ gifs }) => (
  <>
    {gifs.map(g => (
      <Mutation
        mutation={LIKE_GIF_QUERY}
        variables={{ id: g.id, liked: g.status.liked }}
      >
        {toggleLike => (
          <img
            key={g.id}
            style={{ margin: "24px" }}
            src={g.images.fixed_height_small_still.url}
            onClick={() => toggleLike(g.id)}
          />
        )}
      </Mutation>
    ))}
  </>
);
