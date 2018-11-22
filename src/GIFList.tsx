import React from "react";
import { Mutation } from "react-apollo";
import { LIKE_GIF_QUERY } from "./graphql/queries";
import { MyGIFObject } from "./GifSearchComponent";

const Heart = () => (
  <span
    style={{
      fontSize: "24px",
      right: "9px",
      color: "red",
      position: "absolute"
    }}
  >
    {"❤"}
  </span>
);

export const Image: React.SFC<{
  src: string;
  liked: boolean;
  onClick: () => any;
}> = ({ src, liked, onClick }) => (
  <div
    style={{ position: "relative", margin: "24px", display: "inline-block" }}
  >
    <img
      onClick={onClick}
      src={src}
      style={{
        cursor: "pointer",
        borderRadius: "15px",
        border: `3px solid ${liked ? "#F00" : "#FFF"}`
      }}
    />
    {liked ? <Heart /> : null}
  </div>
);

export const GIFList: React.SFC<{
  gifs: MyGIFObject[];
}> = ({ gifs }) => (
  <>
    <Mutation mutation={LIKE_GIF_QUERY}>
      {mutate =>
        gifs.map((gif, i) => {
          return (
            <span key={gif.id} data-key={gif.id}>
              <Image
                src={gif.images.fixed_height_small_still.url}
                liked={gif.status.liked}
                onClick={() =>
                  mutate({
                    variables: { id: gif.id, liked: !gif.status.liked }
                  })
                }
              />
            </span>
          );
        })
      }
    </Mutation>
  </>
);
