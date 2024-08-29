import { useTrackPlayerStore } from "../store/TrackPlayerStore";
import getThumbnail from "../utils/getThumnail";
import { CloseCircle, Headphone, Heart } from "iconsax-react";
import { BsFillPlayFill } from "react-icons/bs";
import { motion } from "framer-motion";
import { useAppSettingStore } from "../store/AppSettingStore";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getArtist, getInfo } from "../services/MusicService";
import dayjs from "dayjs";
import useTrackPlayer from "../hooks/useTrackPlayer";
import ToggleLikeButton from "./ToggleLikeButton";

function formatNumber(num: number) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B"; // Tỷ
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  } else {
    return num.toString();
  }
}

const NowPlaying = () => {
  const { queue, currentSong, playlist } = useTrackPlayerStore();

  const { nowPlayingVisible, setNowPlayingVisible } = useAppSettingStore();

  const { handlePlaySong } = useTrackPlayer();

  const currentSongIndex = queue.findIndex(
    (item) => item.encodeId === currentSong?.encodeId
  );

  const { data: artist } = useQuery({
    queryKey: ["artist", currentSong?.encodeId],
    queryFn: async () => {
      const res = await getArtist(currentSong?.artists?.[0]?.alias);
      return res.data.data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: songInfo } = useQuery({
    queryKey: ["info-song", currentSong?.encodeId],
    queryFn: async () => {
      const res = await getInfo(currentSong?.encodeId);
      return res.data.data;
    },
  });

  return (
    <motion.div
      layout
      key={nowPlayingVisible ? "queue" : "none"}
      style={{
        height: "calc(100vh-80px)",
        width: nowPlayingVisible ? 400 : 0,
        minWidth: nowPlayingVisible ? 400 : 0,
        display: nowPlayingVisible ? "flex" : "none",
        flexDirection: "column",
      }}
      className="bg-base-200 rounded-lg  flex-col overflow-y-auto 0 overflow-x-hidden pb-20 "
    >
      <div className="flex flex-row items-center justify-between  py-4 sticky bg-base-200 top-0 w-full z-50 px-2">
        <span className="text-lg font-bold ml-3 hover:underline">
          <Link to={playlist?.link!}>{playlist?.title}</Link>
        </span>
        <motion.div className="div" whileHover={{ scale: 1.1 }}>
          <CloseCircle
            className="cursor-pointer mr-1"
            size="24"
            color="oklch(var(--bc))"
            onClick={() => setNowPlayingVisible(false)}
          />
        </motion.div>
      </div>

      <div className="mt-4 px-2">
        <div className="bg-base-300 rounded-lg mx-2">
          <img
            src={getThumbnail(currentSong?.thumbnailM) as string}
            alt="song-img"
            className="rounded-t-lg"
          />
          <div className="mt-2 flex flex-row items-center justify-between px-3 py-2">
            <div>
              <span className="text-xl font-bold">{currentSong?.title}</span>
              <div>
                <Link
                  to={`/artist/${currentSong?.artists?.[0]?.alias}`}
                  className="hover:underline"
                >
                  {currentSong?.artists?.[0]?.name}
                </Link>
              </div>
            </div>
            <ToggleLikeButton />
          </div>
        </div>

        {/* artis card */}
        {artist && (
          <div className="relative mt-4 px-2">
            <div className="relative">
              <span className="absolute top-2 left-4 font-semibold z-10">
                Giới thiệu về nghệ sĩ
              </span>
              <img
                src={artist?.thumbnailM}
                alt=""
                className="rounded-t-lg object-cover brightness-50"
                style={{
                  aspectRatio: 4 / 3,
                }}
              />
            </div>
            <div className="bg-base-300 flex flex-col px-4 rounded-b-lg p-2">
              <Link
                to={`/artist/${artist?.alias}`}
                className="font-bold hover:underline"
              >
                {artist?.name}
              </Link>
              <span>Ngày sinh: {artist?.birthday || "không rõ"}</span>
              <span>Người theo dõi: {artist?.follow} </span>
            </div>
          </div>
        )}
        <div className="relative mt-4 mx-2 bg-base-300 flex flex-col px-4 rounded-lg">
          <div className="py-2 flex flex-col">
            <span>
              Ngày phát hành:{" "}
              {songInfo?.releaseDate
                ? dayjs.unix(songInfo?.releaseDate).format("DD/MM/YYYY")
                : "Không rõ"}
            </span>
            <span>
              Tác giả:{" "}
              {songInfo?.composers?.map((item: any) => item?.name).join(", ")}
            </span>
            <span>
              Thể loại:{" "}
              {songInfo?.genres?.map((item: any) => item?.name).join(", ")}
            </span>
            <span>
              Nghệ sĩ:{" "}
              {songInfo?.artists?.map((item: any) => item?.name).join(", ")}
            </span>
            <div className="flex flex-row">
              <div className="flex flex-row  items-center mr-2 gap-x-1">
                <Heart size="18" color="oklch(var(--bc))" variant="Bold" />
                <span style={{ color: " oklch(var(--bc))" }}>
                  {formatNumber(songInfo?.like ?? 0)}
                </span>
              </div>
              <div className="flex flex-row  items-center gap-x-1">
                <Headphone
                  size="18"
                  color={"oklch(var(--bc))"}
                  variant="Bold"
                />
                <span style={{ color: "oklch(var(--bc))" }}>
                  {formatNumber(songInfo?.listen ?? 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-4 mx-2 bg-base-300 flex flex-col px-4 rounded-lg py-2">
          <span className="font-semibold">Tiếp theo trong danh sách chờ</span>
          <div className="flex flex-row items-center gap-2 mt-1 group cursor-pointer">
            <div className="relative w-12 h-12">
              <img
                src={
                  currentSongIndex === playlist.songs.length - 1
                    ? queue?.[0]?.thumbnailM
                    : queue?.[currentSongIndex + 1]?.thumbnailM
                }
                alt=""
                className="w-full h-full rounded-lg group-hover:brightness-50"
              />
              <div
                className="absolute top-0 left-0 w-full h-full  justify-center items-center hidden group-hover:flex flex-1"
                onClick={() =>
                  handlePlaySong(
                    currentSongIndex === playlist.songs.length - 1
                      ? queue?.[0]
                      : queue[currentSongIndex + 1],
                    playlist
                  )
                }
              >
                <BsFillPlayFill />
              </div>
            </div>
            <div className="flex flex-col flex-1">
              <span className="line-clamp-1">
                {currentSongIndex === playlist.songs.length - 1
                  ? queue?.[0]?.title
                  : queue?.[currentSongIndex + 1]?.title}
              </span>
              <span className="line-clamp-1">
                {currentSongIndex === playlist.songs.length - 1
                  ? queue?.[0]?.artistsNames
                  : queue?.[currentSongIndex + 1]?.artistsNames}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NowPlaying;
