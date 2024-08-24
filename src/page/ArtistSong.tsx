import { useTrackPlayerStore } from "../store/TrackPlayerStore";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import useTrackPlayer from "../hooks/useTrackPlayer";
import caculateTime from "../utils/caculateTime";
import { AnimatePresence, motion } from "framer-motion";
import Header from "../components/Header";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getArtistSong } from "../services/MusicService";
import playingAnimation from "../assets/playing.json";
import { useQuery } from "@tanstack/react-query";

import Lottie from "lottie-react";
import { useAppContext } from "../context/AppProvider";
import { useAppSettingStore } from "../store/AppSettingStore";

const ArtistSong = () => {
  const { isPlaying, currentSong, playlist, setIsPlaying } =
    useTrackPlayerStore();

  const { id, name } = useParams();

  const { displayMenu } = useAppContext();

  const { setSelectedTrack } = useAppSettingStore();

  const { data: artist, isFetching } = useQuery({
    queryKey: ["artist-songs", id],
    queryFn: async () => {
      const res = await getArtistSong(id!, 1, 999);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const { handlePlaySong } = useTrackPlayer();

  const stickyRef = useRef<HTMLDivElement>(null);

  const [headerColor, setHeaderColor] = useState("transparent");

  const [showHeaderContent, setShowHeaderContent] = useState(false);

  const handleButtonPlay = () => {
    if (playlist.encodeId == artist?.alias) {
      setIsPlaying(!isPlaying);
    } else {
      handlePlaySong(artist?.items[0], {
        encodeId: artist?.alias,
        songs: artist?.items,
        title: artist?.name,
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        const stickyOffsetTop = stickyRef.current.getBoundingClientRect().top;
        console.log(stickyOffsetTop);
        setHeaderColor(
          stickyOffsetTop < 100 ? "oklch(var(--b3))" : "transparent"
        );
        setShowHeaderContent(stickyOffsetTop < 100 ? true : false);
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setHeaderColor("transparent");
    setShowHeaderContent(false);
  }, [id]);

  return (
    <div className="w-full pb-4 rounded-md overflow-y-scroll mx-2 bg-base-200">
      {isFetching ? (
        <div className="flex justify-center items-center h-full w-full">
          <span className="loading loading-dots loading-lg text-primary"></span>
        </div>
      ) : (
        <div>
          <Header
            color={headerColor}
            content={
              showHeaderContent ? (
                <AnimatePresence>
                  <motion.div
                    className="flex flex-row items-center gap-3"
                    key={showHeaderContent ? 1 : 0}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <div
                      className="bg-primary w-12 h-12 cursor-pointer rounded-full  shadow-md justify-center flex items-center transition-all duration-300 hover:scale-105"
                      onClick={handleButtonPlay}
                    >
                      {isPlaying && playlist.encodeId == artist?.alias ? (
                        <BsFillPauseFill
                          className="text-[28px]"
                          color="oklch(var(--pc))"
                        />
                      ) : (
                        <BsFillPlayFill
                          className="text-[28px]"
                          color="oklch(var(--pc))"
                        />
                      )}
                    </div>
                    <span className="font-bold span-xl text-white ">
                      {name}
                    </span>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <></>
              )
            }
          />

          <div className="pl-4 pt-4 h-64" style={{}}></div>
          <div className="-mt-64 mx-6 flex flex-col" ref={stickyRef}>
            <div>
              <div className=" span-lg font-semi-bold flex  mt-8 justify-between items-center flex-row">
                <div className=" font-bold text-2xl mb-2">Tất cả bài hát</div>
              </div>
              <div>
                {artist?.items?.map((pl: any, index: number) => (
                  <motion.div
                    onContextMenu={(e) => {
                      setSelectedTrack(pl);
                      displayMenu(e);
                    }}
                    key={pl.encodeId}
                    className="flex flex-row justify-between items-center  hover:bg-base-300 py-3 rounded-md group cursor-pointer my-2"
                  >
                    <div className="flex flex-row items-center flex-[2] mr-4 ">
                      <div className="mr-3 font-bold  w-12 justify-center items-center flex h-12">
                        {currentSong?.encodeId == pl.encodeId && isPlaying ? (
                          <Lottie loop animationData={playingAnimation} />
                        ) : (
                          <div
                            className="w-12 justify-center items-center flex h-12"
                            style={{
                              color:
                                pl?.encodeId === currentSong?.encodeId
                                  ? "oklch(var(--p))"
                                  : "oklch(var(--bc))",
                            }}
                          >
                            {index + 1}
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <img
                          src={pl?.thumbnail}
                          alt=""
                          className="w-12 h-12 rounded-lg group-hover:brightness-50"
                        />
                        <div
                          className="hidden group-hover:flex w-12  h-12  justify-center items-center absolute top-0 left-0"
                          onClick={() =>
                            handlePlaySong(pl, {
                              encodeId: artist?.alias,
                              songs: artist?.items,
                              title: artist?.name,
                              link: "/Artist-Song/" + id,
                            })
                          }
                        >
                          {currentSong?.encodeId == pl.encodeId && isPlaying ? (
                            <BsFillPauseFill className="text-[18px] text-base-content" />
                          ) : (
                            <BsFillPlayFill className="text-[18px] text-base-content" />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col ml-2 justify-center flex-1">
                        <span
                          className="font-medium line-clamp-1"
                          style={{
                            color:
                              pl?.encodeId === currentSong?.encodeId
                                ? "oklch(var(--p))"
                                : "oklch(var(--bc))",
                          }}
                        >
                          {pl.title}
                        </span>
                        <span className=" line-clamp-1 text-base-content/80">
                          {pl.artistsNames}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 flex-wrap">
                      {pl.album ? (
                        <Link
                          to={`/playlist/${pl.album.encodeId}`}
                          className="hover:underline"
                        >
                          <span className="text-base-content/80 line-clamp-1">
                            {pl.album?.title || pl.title}
                          </span>
                        </Link>
                      ) : (
                        <span className="text-base-content/80">
                          {pl.album?.title || pl.title}
                        </span>
                      )}
                    </div>
                    <div className="flex-[0.5] flex justify-center items-center">
                      <span className="font-normal text-base-content/80">
                        {caculateTime(pl.duration)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistSong;
