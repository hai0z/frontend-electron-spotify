import getThumbnail from "../utils/getThumnail";
import React from "react";

interface Props {
  playlistLength: number;
  songs: any[];
  width: number;
  height: number;
}
const RenderPlaylistThumbnail = ({
  playlistLength,
  songs,
  width,
  height,
}: Props) => {
  const renderImg: Record<number, React.JSX.Element> = {
    1: (
      <div
        className="z-50"
        style={{
          width,
          height,
        }}
      >
        <img
          src={getThumbnail(songs?.[0]?.thumbnail, 360) as string}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    ),
    2: (
      <div
        className="z-50 flex-row flex-wrap flex"
        style={{
          width,
          height,
        }}
      >
        <img
          src={getThumbnail(songs?.[0]?.thumbnail, 360) as string}
          style={{ width: width / 2, height: height / 2 }}
        />
        <div style={{ width: width / 2, height: height / 2 }}></div>
        <div style={{ width: width / 2, height: height / 2 }}></div>
        <img
          src={getThumbnail(songs?.[1]?.thumbnail, 360) as string}
          style={{ width: width / 2, height: height / 2 }}
        />
      </div>
    ),
    3: (
      <div
        className="z-50 flex-row justify-between flex-wrap flex "
        style={{
          width,
          height,
        }}
      >
        <div
          style={{ width: width / 2, height: height }}
          className="flex flex-col"
        >
          <img
            src={getThumbnail(songs?.[0]?.thumbnail, 360) as string}
            style={{ width: width / 2, height: height / 2 }}
          />
          <img
            src={getThumbnail(songs?.[1]?.thumbnail, 360) as string}
            style={{ width: width / 2, height: height / 2 }}
          />
        </div>
        <div
          style={{ width: width / 2, height: height }}
          className="flex flex-col justify-center"
        >
          <img
            src={getThumbnail(songs?.[2]?.thumbnail, 360) as string}
            style={{ width: width / 2, height: height / 2 }}
          />
        </div>
      </div>
    ),
    4: (
      <div
        className="flex flex-row flex-wrap z-50 "
        style={{
          width,
          height,
        }}
      >
        <img
          src={
            getThumbnail(songs?.[playlistLength - 1]?.thumbnail, 360) as string
          }
          style={{
            width: width / 2,
            height: height / 2,
          }}
        />
        <img
          src={
            getThumbnail(songs?.[playlistLength - 2]?.thumbnail, 360) as string
          }
          style={{
            width: width / 2,
            height: height / 2,
          }}
        />
        <img
          src={
            getThumbnail(songs?.[playlistLength - 3]?.thumbnail, 360) as string
          }
          style={{
            width: width / 2,
            height: height / 2,
          }}
        />
        <img
          src={
            getThumbnail(songs?.[playlistLength - 4]?.thumbnail, 360) as string
          }
          style={{
            width: width / 2,
            height: height / 2,
          }}
        />
      </div>
    ),
  };
  return renderImg[playlistLength >= 4 ? 4 : playlistLength];
};

export default RenderPlaylistThumbnail;
