import PlaylistCover from "../../components/PlaylistCover";
import useTrackPlayer from "../../hooks/useTrackPlayer";
import { useAppSettingStore } from "../../store/AppSettingStore";
import { useTrackPlayerStore } from "../../store/TrackPlayerStore";
import caculateTime from "../..//utils/caculateTime";
import getThumbnail from "../../utils/getThumnail";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getHub, getRecommendSong, search } from "../../services/MusicService";
import Lottie from "lottie-react";
import playingAnimation from "../../assets/playing.json";
import { useAppContext } from "../../context/AppProvider";

const SearchScreen = () => {
  const [params] = useSearchParams();

  const { currentSong, isPlaying } = useTrackPlayerStore();

  const { isCollapseLibrary, queueVisible, nowPlayingVisible } =
    useAppSettingStore();

  const { handlePlaySong } = useTrackPlayer();

  const [recommendSong, setRecommendSong] = React.useState({
    items: [],
  });
  const { displayMenu } = useAppContext();

  const { setSelectedTrack } = useAppSettingStore();

  const { data: searchResult, isLoading } = useQuery({
    queryKey: ["search", params.get("q")],
    queryFn: async () => {
      const data = await search(params.get("q")!);

      if (data.data.counter.song > 0) {
        const recommendSongRespone = await getRecommendSong(
          data?.data.songs[0].encodeId
        );

        setRecommendSong(recommendSongRespone.data.data);
      }
      return data.data;
    },
  });
  const { data: hub } = useQuery({
    queryKey: ["hub"],
    queryFn: async () => {
      const data = await getHub();
      return data.data;
    },
  });

  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="loading loading-dots loading-lg text-primary"></div>
      </div>
    );
  return (
    <div>
      {params.get("q") ? (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className={`flex  gap-8 mt-10 px-4 ${
                (!isCollapseLibrary && queueVisible) || nowPlayingVisible
                  ? "flex-col"
                  : "flex-row"
              }`}
            >
              {searchResult?.top && searchResult?.top.objectType === "song" && (
                <div className="flex flex-[1.5] flex-col">
                  <p className="text-2xl font-bold mb-4 ">Kết quả hàng đầu</p>
                  <div className="bg-base-100 flex flex-col rounded-md p-6 cursor-pointer relative group hover:bg-base-300">
                    <img
                      src={
                        getThumbnail(searchResult?.top?.thumbnailM) as string
                      }
                      alt=""
                      className="w-24 h-24 rounded-lg"
                    />

                    <p className="font-bold text-3xl mt-4">
                      {searchResult?.top?.title}
                    </p>
                    <div className="flex flex-row mt-4 gap-6 items-center  mr-16">
                      <span>{searchResult?.top?.artistsNames}</span>
                      <div className="flex justify-center items-center px-3 py-1 rounded-full bg-secondary font-semibold">
                        <span className="text-secondary-content">Song</span>
                      </div>
                    </div>
                    <div
                      onClick={() =>
                        handlePlaySong(searchResult?.top, {
                          encodeId: "",
                          title: searchResult?.top?.title,
                          songs: [searchResult?.top, ...recommendSong.items],
                          link: "#",
                        })
                      }
                      className={`${
                        currentSong?.encodeId === searchResult?.top?.encodeId &&
                        isPlaying &&
                        "opacity-100 bottom-4"
                      }
                  bg-primary w-12 h-12 rounded-full absolute right-6 bottom-0 justify-center flex items-center opacity-0 group-hover:opacity-100  transition-all duration-300 group-hover:bottom-4
                 `}
                    >
                      {isPlaying &&
                      searchResult?.top?.encodeId === currentSong?.encodeId ? (
                        <BsFillPauseFill className="text-primary-content text-[24px]" />
                      ) : (
                        <BsFillPlayFill className="text-primary-content text-[24px]" />
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className=" flex flex-[2] flex-col">
                <p className=" text-2xl font-bold mb-4 ">Bài hát</p>
                <div className="flex flex-col cursor-pointer mr-4">
                  {searchResult?.songs?.map((song: any, index: number) => (
                    <motion.div
                      onContextMenu={(e) => {
                        setSelectedTrack(song);
                        displayMenu(e);
                      }}
                      key={song.encodeId}
                      className="flex flex-row justify-between items-center  hover:bg-base-300 py-3 rounded-md group cursor-pointer"
                    >
                      <div className="flex flex-row items-center flex-[2] mr-4 ">
                        <div className="mr-3 font-bold  w-12 justify-center items-center flex h-12">
                          {currentSong?.encodeId == song.encodeId &&
                          isPlaying ? (
                            <Lottie loop animationData={playingAnimation} />
                          ) : (
                            <div
                              className="w-12 justify-center items-center flex h-12"
                              style={{
                                color:
                                  song?.encodeId === currentSong?.encodeId
                                    ? "oklch(var(--p))"
                                    : "oklch(var(--bc))",
                              }}
                            >
                              {index + 1}
                            </div>
                          )}
                        </div>

                        <div className="relative  w-12 h-12">
                          <img
                            src={song?.thumbnailM}
                            alt=""
                            className="w-12 h-12 rounded-lg group-hover:brightness-50"
                          />
                          <div
                            className="hidden group-hover:flex w-12  h-12  justify-center items-center absolute top-0 left-0"
                            onClick={() =>
                              handlePlaySong(song, {
                                encodeId: "",
                                title: searchResult?.top?.title,
                                songs: [song, ...recommendSong.items],
                                link: "#",
                              })
                            }
                          >
                            {currentSong?.encodeId == song.encodeId &&
                            isPlaying ? (
                              <BsFillPauseFill className="text-[18px]" />
                            ) : (
                              <BsFillPlayFill className="text-[18px]" />
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col ml-2 justify-center flex-1">
                          <span
                            className="font-medium line-clamp-1"
                            style={{
                              color:
                                song?.encodeId === currentSong?.encodeId
                                  ? "oklch(var(--p))"
                                  : "oklch(var(--bc))",
                            }}
                          >
                            {song.title}
                          </span>
                          <span className=" line-clamp-1 text-base-content/80">
                            {song.artistsNames}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 flex-wrap">
                        {song.album ? (
                          <Link
                            to={`/playlist/${song.album.encodeId}`}
                            className="hover:underline"
                          >
                            <span className="text-base-content/80 line-clamp-1">
                              {song.album?.title || song.title}
                            </span>
                          </Link>
                        ) : (
                          <span className="text-base-content/80">
                            {song.album?.title || song.title}
                          </span>
                        )}
                      </div>
                      <div className="flex-[0.5] flex justify-center items-center">
                        <span className="font-normal text-base-content/80">
                          {caculateTime(song.duration)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-2xl pb-4 mt-4 font-bold px-4">Nghệ sĩ</p>
            <div className="flex flex-row gap-4 cursor-pointer flex-wrap px-4">
              {searchResult?.artists?.map((a: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col w-52 h-72 bg-base-100 hover:bg-base-300 rounded-md justify-center items-center"
                  >
                    <img
                      src={a?.thumbnailM}
                      alt=""
                      className="w-44 h-44 rounded-full"
                    />
                    <div className=" self-center pl-4 flex flex-col justify-center items-center mt-2">
                      <Link
                        to={`/artist/${a.alias}`}
                        className="hover:underline font-bold text-lg"
                      >
                        {a.name}
                      </Link>
                      <span className="">{a?.totalFollow} người theo dõi</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="pt-8">
          <main className="box-border pb-[96px]">
            <div className="mt-8 px-4">
              {hub?.data?.genre?.map((e: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-end text-[28px] font-bold  mt-9 mb-3 uppercase">
                    {i === 0 ? "Khám phá" : e.title}
                  </div>
                  <div className="flex flex-row flex-wrap gap-x-6 gap-y-11">
                    {e?.playlists?.map((element: any, index: number) => (
                      <PlaylistCover
                        key={index}
                        title={element.title}
                        link={`/playlist/${element.encodeId}`}
                        thumbnail={element?.thumbnail}
                        sortDescription={element.sortDescription}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default SearchScreen;
