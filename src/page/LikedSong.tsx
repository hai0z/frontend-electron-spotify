import { useTrackPlayerStore } from "../store/TrackPlayerStore";
import { Clock, Heart } from "iconsax-react";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import Lottie from "lottie-react";
import useImageColor from "../hooks/useImageColor";
import useTrackPlayer from "../hooks/useTrackPlayer";
import caculateTime from "../utils/caculateTime";
import { AnimatePresence, motion } from "framer-motion";
import Header from "../components/Header";
import { useEffect, useRef, useState } from "react";
import calculateColorWithOpacity from "../utils/calculateColorWithOpacity";
import { useUserStore } from "../store/UserStore";
import RenderPlaylistThumbnail from "../components/PlaylistThumbnail";
import { Link, useParams } from "react-router-dom";
import playingAnimation from "../assets/playing.json";
import { getImageColor } from "../utils/getImageColor";
import Loading from "../components/Loading";
import { DEFAULT_IMG } from "../constants";
import { useAppContext } from "../context/AppProvider";
import { useAppSettingStore } from "../store/AppSettingStore";
const LikedSongPage = () => {
  const { isPlaying, currentSong, setIsPlaying, playlist } =
    useTrackPlayerStore();

  const { likedSongs } = useUserStore();

  const { displayMenu } = useAppContext();

  const { setSelectedTrack } = useAppSettingStore();

  const { id } = useParams();

  const data = likedSongs;

  const [vibrantColor, setVibrantColor] = useState("transparent");

  const gradientColor = useImageColor(vibrantColor, 35);
  const { handlePlaySong } = useTrackPlayer();

  const stickyRef = useRef<HTMLDivElement>(null);

  const [isStuck, setIsStuck] = useState(false);

  const [headerColor, setHeaderColor] = useState("transparent");

  const [showHeaderContent, setShowHeaderContent] = useState(false);

  const [loading, setLoading] = useState(true);

  const handleButtonPlay = () => {
    if (data.length > 0) {
      if (playlist.encodeId == "likedSongs") {
        setIsPlaying(!isPlaying);
      } else {
        handlePlaySong(data[0], {
          encodeId: "likedSongs",
          songs: data,
          title: "Bài hát đã thích",
        });
      }
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        const stickyOffsetTop = stickyRef.current.getBoundingClientRect().top;
        console.log(stickyOffsetTop);
        const isSticky = stickyOffsetTop <= 105;
        setIsStuck(isSticky);
        setHeaderColor(
          stickyOffsetTop < 250
            ? calculateColorWithOpacity(gradientColor, 0.8)
            : "transparent"
        );
        setShowHeaderContent(stickyOffsetTop < 250 ? true : false);
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
  }, [vibrantColor]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [id]);

  useEffect(() => {
    const getVibrantColor = async () => {
      setLoading(true);
      const vibrantColorRes = await getImageColor(
        data.length > 0 ? data?.at(-1).thumbnailM : DEFAULT_IMG
      );
      setVibrantColor(vibrantColorRes as string);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    getVibrantColor();
  }, [id]);

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="w-full pb-4 rounded-md overflow-y-scroll mx-2 bg-base-200">
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
                  {isPlaying && playlist.encodeId == "likedSongs" ? (
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
                <span className="font-bold text-xl">{"Bài hát đã thích"}</span>
              </motion.div>
            </AnimatePresence>
          ) : (
            <></>
          )
        }
      />
      <div className="-mt-16">
        <div
          className="w-full h-[350px] px-6 transition-colors duration-200 rounded-t-md pt-16 flex flex-row"
          style={{
            backgroundColor: gradientColor + "90",
          }}
        >
          <div className="mt-4 rounded-sm marker:flex justify-center items-center">
            {data.length > 0 ? (
              <RenderPlaylistThumbnail
                songs={data}
                width={240}
                playlistLength={data.length}
                height={240}
              />
            ) : (
              <div>
                <div
                  style={{ width: 240, height: 240 }}
                  className="justify-center items-center flex bg-gradient-to-br from-primary to-secondary"
                >
                  <Heart size={96} color="white" />
                </div>
              </div>
            )}
          </div>
          <div className="self-center ml-8 flex-1">
            <span className=" text-[16px] font-bold">{"Playlist"}</span>
            <p className=" font-bold text-4xl font-sans">
              {"Bài hát đã thích"}
            </p>
          </div>
        </div>
      </div>
      <div
        className="pl-4 pt-4 h-64"
        style={{
          background: `linear-gradient(${gradientColor}70, transparent)`,
        }}
      ></div>
      <div className="-mt-64 pt-6">
        <div
          className="bg-primary w-[55px] h-[55px] cursor-pointer rounded-full  shadow-md justify-center flex items-center ml-4 transition-all duration-300 hover:scale-105"
          onClick={handleButtonPlay}
        >
          {isPlaying && playlist.encodeId == "likedSongs" ? (
            <BsFillPauseFill className="text-[28px]" color="oklch(var(--pc))" />
          ) : (
            <BsFillPlayFill className="text-[28px]" color="oklch(var(--pc))" />
          )}
        </div>
        <div
          ref={stickyRef}
          style={{
            backgroundColor: isStuck ? "oklch(var(--b3))" : "transparent",
            marginInline: isStuck ? 0 : 16,
            paddingInline: isStuck ? 16 : 0,
          }}
          className="flex flex-row justify-between items-center mt-4 sticky top-16 left-0 py-2 border-b border-base-content/50 z-[2]"
        >
          <div className="flex flex-[2]">
            <div className=" w-12 flex justify-center items-center">
              <p>
                <span>#</span>
              </p>
            </div>
            <p className="ml-3">Title</p>
          </div>
          <div className="flex flex-1">
            <p className="">Album</p>
          </div>
          <div className="flex flex-[0.5] justify-center items-center">
            <Clock size="24" color="oklch(var(--bc))" />
          </div>
        </div>
        <div className="px-4 mt-4">
          {data?.map((pl: any, index: number) => {
            return (
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
                          encodeId: "likedSongs",
                          songs: data,
                          title: "Bài hát đã thích",
                          link: "likedSongs",
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LikedSongPage;
