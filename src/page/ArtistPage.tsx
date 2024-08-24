import { useTrackPlayerStore } from "../store/TrackPlayerStore";
import getThumbnail from "../utils/getThumnail";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import useImageColor from "../hooks/useImageColor";
import useTrackPlayer from "../hooks/useTrackPlayer";
import caculateTime from "../utils/caculateTime";
import { AnimatePresence, motion } from "framer-motion";
import Header from "../components/Header";
import { useEffect, useMemo, useRef, useState } from "react";
import calculateColorWithOpacity from "../utils/calculateColorWithOpacity";
import { Link, useParams } from "react-router-dom";
import { getArtist } from "../services/MusicService";
import playingAnimation from "../assets/playing.json";
import { useQuery } from "@tanstack/react-query";
import { getImageColor } from "../utils/getImageColor";
import PlaylistCover from "../components/PlaylistCover";

import { useAppSettingStore } from "../store/AppSettingStore";
import Lottie from "lottie-react";
import { useAppContext } from "../context/AppProvider";

function isKeyExistsInArrayObjects(arr: any, key: any, value: any) {
  for (let obj of arr) {
    if (obj.hasOwnProperty(key) && obj[key] === value) {
      return true;
    }
  }
  return false;
}

const ArtistPage = () => {
  const { isPlaying, currentSong, playlist, setIsPlaying } =
    useTrackPlayerStore();

  const [vibrantColor, setVibrantColor] = useState("transparent");

  const { name } = useParams();

  const {
    nowPlayingVisible,
    queueVisible,
    isCollapseLibrary,
    setSelectedTrack,
  } = useAppSettingStore();
  const { displayMenu } = useAppContext();

  const { data: artist, isFetching } = useQuery({
    queryKey: ["artist", name],
    queryFn: async () => {
      const res = await getArtist(name!);
      const vibrantColorRes = await getImageColor(res.data.data.thumbnailM);
      setVibrantColor(vibrantColorRes as string);
      return res.data.data;
    },
    refetchOnWindowFocus: false,
  });

  const gradientColor = useImageColor(vibrantColor, 35);

  const { handlePlaySong } = useTrackPlayer();

  const stickyRef = useRef<HTMLDivElement>(null);

  const [headerColor, setHeaderColor] = useState("transparent");

  const [showHeaderContent, setShowHeaderContent] = useState(false);

  const handleButtonPlay = () => {
    if (playlist.encodeId == artist?.alias) {
      setIsPlaying(!isPlaying);
    } else {
      handlePlaySong(
        artist?.sections?.filter((type: any) => type.sectionId === "aSongs")[0]
          ?.items[0],
        {
          encodeId: artist?.alias,
          songs: artist?.sections?.filter(
            (type: any) => type.sectionId === "aSongs"
          )[0]?.items,
          title: artist?.name,
        }
      );
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        const stickyOffsetTop = stickyRef.current.getBoundingClientRect().top;
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

  const [singleSlice, setSingleSlice] = useState<number>(5);

  const topSong = useMemo(
    () =>
      artist?.sections
        ?.filter((type: any) => type.sectionId === "aSongs")[0]
        ?.items.filter((i: any) => i.streamingStatus === 1)
        .slice(0, 5),
    [artist]
  );

  useEffect(() => {
    setHeaderColor("transparent");
    setShowHeaderContent(false);
  }, [name]);

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
                    <span className="font-bold span-xl ">{artist?.name}</span>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <></>
              )
            }
          />
          <div className="-mt-16">
            <div className="w-full h-[350px] px-6 transition-colors duration-200 rounded-t-md pt-16 flex flex-row relative">
              <div className="object-cover mt-4 rounded-sm marker:flex justify-center items-center w-full relative">
                <img
                  src={getThumbnail(artist?.thumbnailM) as string}
                  alt=""
                  className="object-cover absolute"
                  style={{
                    aspectRatio: "16/9",
                    height: 200,
                    width: "100%",
                    filter: "blur(75px)",
                    zIndex: 1,
                  }}
                />
                <div className="absolute z-[2] flex flex-row items-center  w-full">
                  <img
                    src={getThumbnail(artist?.thumbnailM) as string}
                    alt="img"
                    className="object-cover w-64 h-64 rounded-full"
                  />
                  <div className="ml-4 flex flex-col flex-1">
                    <div>
                      <span className="text-7xl font-bold w-full  text-wrap">
                        {artist?.name}
                      </span>
                    </div>
                    <span className="text-xl font-semibold mt-3">
                      {artist?.follow} người theo dõi
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="pl-4 pt-4 h-64"
            style={{
              background: `linear-gradient(${gradientColor}20, transparent)`,
            }}
          ></div>
          <div className="-mt-64 mx-6 flex flex-col" ref={stickyRef}>
            {isKeyExistsInArrayObjects(
              artist?.sections,
              "sectionId",
              "aSongs"
            ) && (
              <div>
                <div className=" span-lg font-semi-bold flex  mt-8 justify-between items-center flex-row">
                  <div className=" font-bold span-lg mb-2">Bài hát nổi bật</div>
                  <Link
                    to={"/Artist-Song/" + artist?.id + `/${artist?.name}`}
                    className="underline"
                  >
                    Xem thêm
                  </Link>
                </div>
                <div>
                  {topSong?.map((pl: any, index: number) => (
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
                                songs: artist?.sections?.filter(
                                  (type: any) => type.sectionId === "aSongs"
                                )[0]?.items,
                                title: artist?.name,
                                link: "/artist/" + artist?.alias,
                              })
                            }
                          >
                            {currentSong?.encodeId == pl.encodeId &&
                            isPlaying ? (
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
            )}
            {/* album */}
            {isKeyExistsInArrayObjects(
              artist?.sections,
              "sectionId",
              "aAlbum"
            ) && (
              <div>
                <div className="text-2xl font-semibold mb-4">Albums</div>
                <div className="flex flex-row flex-wrap gap-x-4 gap-y-4">
                  {artist?.sections
                    ?.filter((type: any) => type.sectionId === "aAlbum")[0]
                    ?.items.map((item: any, index: number) => (
                      <div key={index}>
                        <PlaylistCover
                          title={item.title}
                          link={`/playlist/${item.encodeId}`}
                          thumbnail={item.thumbnailM}
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
            {/* playlist */}
            {isKeyExistsInArrayObjects(
              artist?.sections,
              "sectionId",
              "aPlaylist"
            ) && (
              <div>
                {artist?.sections
                  ?.filter((type: any) => type.sectionId === "aPlaylist")
                  ?.map((item: any, index: number) => (
                    <div key={index}>
                      <div className="text-2xl font-semibold py-4">
                        {item.title}
                      </div>
                      <div className="flex flex-row flex-wrap gap-x-4 gap-y-4">
                        {item.items.map((item: any, index: number) => (
                          <div key={index}>
                            <PlaylistCover
                              link={`/playlist/${item.encodeId}`}
                              title={item.title}
                              thumbnail={item.thumbnail}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {/* single */}
            {isKeyExistsInArrayObjects(
              artist?.sections,
              "sectionId",
              "aSingle"
            ) && (
              <div>
                {artist?.sections
                  ?.filter((type: any) => type.sectionId === "aSingle")

                  ?.map((item: any, index: number) => (
                    <div key={index}>
                      <div className="flex flex-row items-center justify-between">
                        <div className="text-2xl font-semibold py-4">
                          {item.title}
                        </div>
                        <div
                          className="underline cursor-pointer"
                          onClick={() => {
                            singleSlice !== 5
                              ? setSingleSlice(5)
                              : setSingleSlice(item.items.length);
                          }}
                        >
                          {item.items.length > 5 && (
                            <span>
                              {item.items.length > singleSlice
                                ? "Xem thêm"
                                : "Thu gọn"}
                            </span>
                          )}{" "}
                        </div>
                      </div>
                      <div className="flex flex-row flex-wrap gap-x-4 gap-y-4">
                        {item.items
                          ?.slice(0, singleSlice)
                          .map((item: any, index: number) => (
                            <div key={index}>
                              <PlaylistCover
                                link={`/playlist/${item.encodeId}`}
                                title={item.title}
                                thumbnail={item.thumbnail}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          {/* Relate artis */}
          {isKeyExistsInArrayObjects(
            artist?.sections,
            "sectionId",
            "aReArtist"
          ) && (
            <div className="px-6">
              {artist?.sections?.filter(
                (type: any) => type.sectionId === "aReArtist"
              )[0].items.length > 0 && (
                <div className="text-2xl font-semibold py-4">
                  Có thể bạn thích
                </div>
              )}
              <div className="flex flex-row flex-wrap gap-x-4 gap-y-4">
                {artist?.sections
                  .filter((type: any) => type.sectionId === "aReArtist")[0]
                  ?.items.map((item: any, index: number) => (
                    <div
                      className="bg-base-300 p-1 cursor-pointer hover:bg-base-100 rounded-lg flex justify-center items-center flex-col"
                      style={{
                        width:
                          (!isCollapseLibrary && queueVisible) ||
                          nowPlayingVisible
                            ? 165
                            : 200,
                      }}
                      key={index}
                    >
                      <img src={item.thumbnailM} className="rounded-full p-2" />
                      <div className="w-full flex flex-col justify-center items-center">
                        <Link
                          to={`/artist/${item?.alias}#top`}
                          className=" text-center mt-2 hover:underline text-lg font-bold"
                        >
                          {item.name}
                        </Link>
                        <span className=" text-center">
                          {item.totalFollow} quan tâm
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* info */}
          <div className="px-4 flex flex-col gap-2 py-4">
            <div className=" text-lg font-semibold py-2">Thông tin</div>
            <div>Tên thật: {artist?.realname}</div>
            <div>Ngày sinh: {artist?.birthday || "Không rõ"}</div>

            <div>{artist?.sortBiography.replaceAll("<br>", "")}</div>
            <div>{artist?.biography.replaceAll("<br>", "")}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistPage;
