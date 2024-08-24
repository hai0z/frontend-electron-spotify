"use client";
import useTrackPlayer from "../hooks/useTrackPlayer";
import { useAppSettingStore } from "../store/AppSettingStore";
import { useTrackPlayerStore } from "../store/TrackPlayerStore";
import getThumbnail from "../utils/getThumnail";
import Lottie from "lottie-react";
import { BsFillPlayFill } from "react-icons/bs";
import PlayAnimation from "../assets/playing.json";
import { useAppContext } from "../context/AppProvider";
interface Props {
  data: {
    items: {
      vPop: any[];
    };
  };
}
const NewRelease = ({ data }: Props) => {
  const { currentSong, isPlaying } = useTrackPlayerStore();

  const {
    isCollapseLibrary,
    queueVisible,
    nowPlayingVisible,
    setSelectedTrack,
  } = useAppSettingStore();

  const { handlePlaySong } = useTrackPlayer();

  const { displayMenu } = useAppContext();

  return (
    <div>
      <div className="flex justify-between items-end text-[28px] font-bold  mt-9 mb-3 uppercase">
        Mới phát hành
      </div>
      <div
        className={`grid gap-x-6 gap-y-2 ${
          (!isCollapseLibrary && queueVisible) || nowPlayingVisible
            ? "grid-cols-2"
            : "grid-cols-3"
        }`}
      >
        {data?.items?.vPop
          ?.filter((e: any) => e.streamingStatus === 1)
          .slice(0, 12)
          .map((e: any) => (
            <div
              onContextMenu={(event) => {
                setSelectedTrack(e);
                displayMenu(event);
              }}
              key={e.encodeId}
              className={`${
                isPlaying && e.encodeId === currentSong?.encodeId
                  ? "flex items-center flex-row cursor-pointer bg-base-300 p-2 rounded-xl group"
                  : "flex items-center flex-row cursor-pointer hover:bg-base-300 p-2 rounded-xl group"
              } transition-all duration-150`}
            >
              <div className="relative">
                <div
                  className={`${
                    isPlaying && e.encodeId === currentSong?.encodeId
                      ? "absolute right-0 top-0 w-16 h-16 rounded-md justify-center items-center bg-black/50 flex"
                      : "absolute  right-0 top-0 w-16 h-16 rounded-md justify-center items-center hidden group-hover:bg-black/50 group-hover:flex"
                  }`}
                  onClick={() =>
                    handlePlaySong(e, {
                      encodeId: "",
                      title: "Mới phát hành",
                      songs: data.items.vPop.filter(
                        (e: any) => e.streamingStatus === 1
                      ),
                    })
                  }
                >
                  {isPlaying && e.encodeId === currentSong?.encodeId ? (
                    <Lottie animationData={PlayAnimation} />
                  ) : (
                    <BsFillPlayFill size={20} />
                  )}
                </div>
                <img
                  src={getThumbnail(e.thumbnail, 1080) as string}
                  alt={e.title}
                  width={64}
                  height={64}
                  className="rounded-lg"
                />
              </div>
              <div className="ml-2 flex flex-wrap flex-col flex-1">
                <p className="text-ellipsis line-clamp-1">{e.title}</p>
                <p className=" text-base-content/40 line-clamp-1 text-ellipsis">
                  {e.artistsNames}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default NewRelease;
