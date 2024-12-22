import { useTrackPlayerStore } from "../store/TrackPlayerStore";
import getThumbnail from "../utils/getThumnail";
import { CloseCircle, Headphone, Heart, MusicCircle } from "iconsax-react";
import { BsFillPlayFill } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSettingStore } from "../store/AppSettingStore";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getArtist, getInfo } from "../services/MusicService";
import dayjs from "dayjs";
import useTrackPlayer from "../hooks/useTrackPlayer";
import ToggleLikeButton from "./ToggleLikeButton";

const formatNumber = (num: number) => {
  const formatter = Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  return formatter.format(num);
};

const NowPlaying = () => {
  const { queue, currentSong, playlist } = useTrackPlayerStore();
  const { nowPlayingVisible, setNowPlayingVisible } = useAppSettingStore();
  const { handlePlaySong } = useTrackPlayer();

  const currentSongIndex = queue.findIndex(
    (item) => item.encodeId === currentSong?.encodeId
  );

  const { data: artist, isLoading: isLoadingArtist } = useQuery({
    queryKey: ["artist", currentSong?.encodeId],
    queryFn: async () => {
      const res = await getArtist(currentSong?.artists?.[0]?.alias);
      return res.data.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!currentSong?.artists?.[0]?.alias,
  });

  const { data: songInfo, isLoading: isLoadingSongInfo } = useQuery({
    queryKey: ["info-song", currentSong?.encodeId],
    queryFn: async () => {
      const res = await getInfo(currentSong?.encodeId);
      return res.data.data;
    },
    enabled: !!currentSong?.encodeId,
  });

  const nextSong =
    currentSongIndex === playlist?.songs?.length - 1
      ? queue?.[0]
      : queue?.[currentSongIndex + 1];

  return (
    <AnimatePresence>
      {nowPlayingVisible && (
        <motion.div
          style={{
            height: "calc(100vh-80px)",
            minWidth: 400,
          }}
          className="card bg-base-200 shadow-xl overflow-y-auto overflow-x-hidden pb-20"
        >
          <div className="sticky top-0 z-50 navbar bg-base-200/95 backdrop-blur-md">
            <div className="flex-1">
              <Link
                to={playlist?.link!}
                className="btn btn-ghost gap-2 text-lg font-bold"
              >
                <MusicCircle variant="Bold" />
                {playlist?.title}
              </Link>
            </div>
            <div className="flex-none">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-ghost btn-circle"
                onClick={() => setNowPlayingVisible(false)}
              >
                <CloseCircle variant="Bold" />
              </motion.button>
            </div>
          </div>

          <motion.div
            className="p-4 space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div className="card bg-base-300 shadow-xl overflow-hidden">
              <figure>
                <motion.img
                  src={currentSong?.thumbnailM}
                  alt="song-img"
                  className="w-full"
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title group">
                  <span className="group-hover:text-primary transition-colors">
                    {currentSong?.title}
                  </span>
                  <ToggleLikeButton />
                </h2>
                <Link
                  to={`/artist/${currentSong?.artists?.[0]?.alias}`}
                  className="link link-hover text-base-content/70 hover:text-primary transition-colors line-clamp-2"
                >
                  {currentSong?.artists?.[0]?.name}
                </Link>
              </div>
            </motion.div>

            {artist && (
              <motion.div
                className="card bg-base-300 shadow-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <figure className="relative">
                  <div className="absolute top-4 left-4 badge badge-primary">
                    Giới thiệu về nghệ sĩ
                  </div>
                  <img
                    src={artist?.thumbnailM}
                    alt=""
                    className="w-full object-cover brightness-50 hover:brightness-75 transition-all duration-500"
                    style={{ aspectRatio: "4/3" }}
                  />
                </figure>
                <div className="card-body">
                  <Link
                    to={`/artist/${artist?.alias}`}
                    className="card-title link link-hover hover:text-primary transition-colors"
                  >
                    {artist?.name}
                  </Link>
                  <div className="stats stats-vertical shadow bg-base-200">
                    <div className="stat">
                      <div className="stat-title">Ngày sinh</div>
                      <div className="stat-value text-lg">
                        {artist?.birthday || "Không rõ"}
                      </div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Người theo dõi</div>
                      <div className="stat-value text-lg">
                        {formatNumber(artist?.follow)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              className="card bg-base-300 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="card-body">
                <div className="stats stats-vertical shadow bg-base-200">
                  <div className="stat">
                    <div className="stat-title">Ngày phát hành</div>
                    <div className="stat-value text-lg">
                      {songInfo?.releaseDate
                        ? dayjs.unix(songInfo?.releaseDate).format("DD/MM/YYYY")
                        : "Không rõ"}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Tác giả</div>
                    <div className="stat-value text-lg">
                      {songInfo?.composers
                        ?.map((item: any) => item?.name)
                        .join(", ") || "Không rõ"}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Thể loại</div>
                    <div className="stat-value text-lg">
                      {songInfo?.genres
                        ?.map((item: any) => item?.name)
                        .join(", ") || "Không rõ"}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Nghệ sĩ</div>
                    <div className="stat-value text-lg">
                      {songInfo?.artists
                        ?.map((item: any) => item?.name)
                        .join(", ")}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <div className="badge badge-lg gap-2 bg-base-200">
                    <Heart size="18" variant="Bold" className="text-red-500" />
                    {formatNumber(songInfo?.like ?? 0)}
                  </div>
                  <div className="badge badge-lg gap-2 bg-base-200">
                    <Headphone
                      size="18"
                      variant="Bold"
                      className="text-primary"
                    />
                    {formatNumber(songInfo?.listen ?? 0)}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="card bg-base-300 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="card-body">
                <h2 className="card-title">Tiếp theo trong danh sách chờ</h2>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 cursor-pointer hover:bg-base-200 p-2 rounded-lg transition-all"
                  onClick={() => handlePlaySong(nextSong, playlist)}
                >
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-lg relative group overflow-hidden">
                      <img
                        src={nextSong?.thumbnailM}
                        alt=""
                        className="group-hover:scale-110 group-hover:brightness-50 transition-all duration-300"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <BsFillPlayFill className="text-2xl" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate hover:text-primary transition-colors">
                      {nextSong?.title}
                    </p>
                    <p className="text-base-content/70 truncate">
                      {nextSong?.artistsNames}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NowPlaying;
