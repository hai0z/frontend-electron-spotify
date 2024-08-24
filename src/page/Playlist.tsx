import { useTrackPlayerStore } from "../store/TrackPlayerStore";
import getThumbnail from "../utils/getThumnail";
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
import { Link, useParams } from "react-router-dom";
import { getDetailPlaylist } from "../services/MusicService";
import playingAnimation from "../assets/playing.json";
import { useQuery } from "@tanstack/react-query";
import { getImageColor } from "../utils/getImageColor";
import { useAppContext } from "../context/AppProvider";
import { useAppSettingStore } from "../store/AppSettingStore";
import { useUserStore } from "../store/UserStore";
import { GREEN } from "../constants";
import { addToLikedPlaylist } from "../services/firebase";
import stringToSlug from "../utils/removeSign";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
const PlaylistPage = () => {
  const { isPlaying, currentSong, playlist, setIsPlaying } =
    useTrackPlayerStore();

  const { setSelectedTrack } = useAppSettingStore();

  const [vibrantColor, setVibrantColor] = useState("transparent");

  const { id } = useParams();

  const { likedPlaylists } = useUserStore();

  const likedPlaylistsIncluded = likedPlaylists.some(
    (pl: any) => pl.encodeId == id
  );
  const { data, isFetching } = useQuery({
    queryKey: ["playlist", id],
    queryFn: async () => {
      const data = await getDetailPlaylist(id!);
      setSearchResult(data);
      const vibrantColorRes = await getImageColor(data?.data?.thumbnailM);
      setVibrantColor(vibrantColorRes as string);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const gradientColor = useImageColor(vibrantColor, 35);

  const { handlePlaySong } = useTrackPlayer();

  const stickyRef = useRef<HTMLDivElement>(null);

  const [isStuck, setIsStuck] = useState(false);

  const [headerColor, setHeaderColor] = useState("transparent");

  const [showHeaderContent, setShowHeaderContent] = useState(false);

  const { displayMenu } = useAppContext();

  const handleButtonPlay = () => {
    if (playlist.encodeId == data?.data?.encodeId) {
      setIsPlaying(!isPlaying);
    } else {
      handlePlaySong(data?.data.song.items[0], {
        encodeId: data?.data?.encodeId,
        songs: data?.data?.song?.items.filter(
          (item: any) => item.streamingStatus === 1
        ),
        title: data?.data?.title,
        link: "/playlist/" + data?.data?.encodeId,
      });
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

  const [searchResult, setSearchResult] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [sort, setSort] = useState({
    type: "title",
    sort: "asc",
  });

  const toggleSort = (type: string) => {
    if (sort.type == type) {
      setSort({
        ...sort,
        sort: sort.sort == "asc" ? "desc" : "asc",
      });
    } else {
      setSort({
        type: type,
        sort: "asc",
      });
    }
  };

  useEffect(() => {
    if (sort.type === "title") {
      setSearchResult({
        ...searchResult,
        data: {
          ...searchResult?.data,
          song: {
            ...searchResult?.data?.song,
            items: searchResult?.data?.song?.items?.sort((a: any, b: any) => {
              if (sort.sort == "asc") {
                return stringToSlug(a.title) > stringToSlug(b.title) ? 1 : -1;
              } else {
                return stringToSlug(a.title) < stringToSlug(b.title) ? 1 : -1;
              }
            }),
          },
        },
      });
    }
  }, [sort]);
  useEffect(() => {
    if (searchQuery.trim().length <= 0) {
      setSearchResult(data);
    } else {
      const result = data?.data?.song?.items?.filter((item: any) => {
        return stringToSlug(item.title).includes(stringToSlug(searchQuery));
      });
      setSearchResult({
        ...data,
        data: {
          ...data?.data,
          song: {
            ...data?.data?.song,
            items: result,
          },
        },
      });
    }
  }, [searchQuery]);
  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
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
                  {isPlaying && playlist.encodeId == data?.data?.encodeId ? (
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
                <span className="font-bold text-xl">{data?.data?.title}</span>
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
          <div className="object-cover mt-4 rounded-sm marker:flex justify-center items-center">
            <img
              src={getThumbnail(data?.data?.thumbnailM) as string}
              alt=""
              className="w-[240px] h-[240px]"
            />
          </div>
          <div className="self-center ml-8 flex-1">
            <span className=" text-[16px] font-bold">
              {data?.data?.isAlbum ? "Album" : "Playlist"}
            </span>
            <p className=" font-bold text-4xl font-sans">{data?.data?.title}</p>
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
        <div className="flex flex-row items-center  justify-between">
          <div className="flex flex-row items-center gap-4">
            <div
              className="bg-primary w-[55px] h-[55px] cursor-pointer rounded-full  shadow-md justify-center flex items-center ml-4 transition-all duration-300 hover:scale-105"
              onClick={handleButtonPlay}
            >
              {isPlaying && playlist.encodeId == data?.data?.encodeId ? (
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
            <div
              onClick={() =>
                addToLikedPlaylist({
                  encodeId: data?.data?.encodeId,
                  thumbnail: data?.data?.thumbnailM,
                  title: data?.data?.title,
                  type: data?.data?.isAlbum ? "album" : "playlist",
                  totalSong: data?.data?.song?.items?.length,
                })
              }
              className="hover:scale-105 transition-all duration-300 cursor-pointer mr-4 tooltip tooltip-right"
              data-tip={
                likedPlaylistsIncluded
                  ? "Xoá khỏi thư viện"
                  : "Thêm vào thư viện"
              }
            >
              <Heart
                size={48}
                variant={likedPlaylistsIncluded ? "Bold" : "Outline"}
                color={likedPlaylistsIncluded ? GREEN : "white"}
              />
            </div>
          </div>
          <div className="flex flex-row items-center ">
            <motion.div className="relative w-64 flex justify-center items-center mt-2 ml-auto mr-4">
              <motion.input
                type="text"
                placeholder={
                  showSearchInput ? "Nhập tên bài hát cần tìm..." : ""
                }
                value={searchQuery}
                className={
                  showSearchInput
                    ? "w-64 rounded-md outline-none input input-sm -right-0 focus:ring-2 pl-3 ring-primary hover:ring-2 absolute transition-all duration-1000"
                    : "w-6 absolute transition-all duration-1000 pl-3 -right-0 rounded-full bg-inherit input input-sm"
                }
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />

              <div className="cursor-pointer absolute hover:bg-base-200 rounded-full right-0 p-1">
                <motion.svg
                  onClick={() => {
                    setShowSearchInput(!showSearchInput);
                    setSearchQuery("");
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </motion.svg>
              </div>
            </motion.div>
          </div>
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
            <div
              className="flex cursor-pointer"
              onClick={() => toggleSort("title")}
            >
              <p className="ml-3">Tiêu đề</p>
              {sort.type === "title" && sort.sort === "asc" ? (
                <IoMdArrowDropdown size="24" color="oklch(var(--p))" />
              ) : (
                <IoMdArrowDropup size="24" color="oklch(var(--p))" />
              )}
            </div>
          </div>
          <div className="flex flex-1">
            <p className="">Album</p>
          </div>
          <div className="flex flex-[0.5] justify-center items-center">
            <Clock size="24" color="oklch(var(--bc))" />
          </div>
        </div>
        <div className="px-4 mt-4">
          {searchResult?.data?.song?.items
            ?.filter((item: any) => item.streamingStatus === 1)
            ?.map((pl: any, index: number) => {
              return (
                <motion.div
                  onContextMenu={(e) => {
                    setSelectedTrack(pl);
                    displayMenu(e);
                  }}
                  key={pl.encodeId}
                  className="flex flex-row justify-between items-center  hover:bg-base-300 py-3 rounded-md group cursor-pointer my-2"
                >
                  <div className="flex flex-row items-center flex-[2]">
                    <div className="mr-3 font-bold  w-12 justify-center items-center flex h-12">
                      {currentSong?.encodeId == pl.encodeId && isPlaying ? (
                        <Lottie
                          className="playing-animation"
                          loop
                          animationData={playingAnimation}
                        />
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

                    <div className="relative  w-12 h-12">
                      <img
                        src={pl?.thumbnail}
                        alt=""
                        className="w-12 h-12 rounded-lg group-hover:brightness-50"
                      />
                      <div
                        className="hidden group-hover:flex w-12  h-12  justify-center items-center absolute top-0 left-0"
                        onClick={() =>
                          handlePlaySong(pl, {
                            encodeId: data?.data?.encodeId,
                            songs: data?.data?.song?.items.filter(
                              (item: any) => item.streamingStatus === 1
                            ),
                            title: data?.data?.title,
                            link: `/playlist/${data?.data?.encodeId}`,
                          })
                        }
                      >
                        {currentSong?.encodeId == pl.encodeId && isPlaying ? (
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

export default PlaylistPage;
