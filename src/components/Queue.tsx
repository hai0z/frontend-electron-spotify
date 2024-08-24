import { useTrackPlayerStore } from "../store/TrackPlayerStore";
import React, { useEffect } from "react";
import getThumbnail from "../utils/getThumnail";
import { CloseCircle } from "iconsax-react";
import useTrackPlayer from "../hooks/useTrackPlayer";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { motion } from "framer-motion";
import { useAppSettingStore } from "../store/AppSettingStore";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
const Queue = () => {
  const { queue, currentSong, playlist, isPlaying } = useTrackPlayerStore();

  const { queueVisible, setQueueVisible } = useAppSettingStore();
  const { handlePlaySong } = useTrackPlayer();

  const { displayMenu } = useAppContext();

  const { setSelectedTrack } = useAppSettingStore();

  const currentSongIndex = queue.findIndex(
    (item) => item.encodeId === currentSong?.encodeId
  );

  const [coppyQueue, setCoppyQueue] = React.useState<any>(queue);

  useEffect(() => {
    const queue = [...playlist.songs];
    const head = queue.slice(0, currentSongIndex);
    const tail = queue.slice(currentSongIndex + 1);
    setCoppyQueue([...tail, ...head]);
  }, [currentSongIndex, queue]);

  return (
    <motion.div
      key={queueVisible ? "queue" : "none"}
      style={{
        height: "calc(100vh-80px)",
        width: queueVisible ? 400 : 0,
        minWidth: queueVisible ? 400 : 0,
        display: queueVisible ? "flex" : "none",
        flexDirection: "column",
      }}
      className="bg-base-200 rounded-lg  flex-col overflow-y-auto 0 overflow-x-hidden"
    >
      <div className="flex flex-row items-center justify-between  py-4 sticky bg-base-200 top-0 w-full z-50 px-2">
        <span className="text-lg font-bold ml-3">Hàng đợi</span>
        <motion.div className="div" whileHover={{ scale: 1.1 }}>
          <CloseCircle
            className="cursor-pointer mr-1"
            size="24"
            color="oklch(var(--bc))"
            onClick={() => setQueueVisible(false)}
          />
        </motion.div>
      </div>
      <div className="mt-4 px-2">
        <span className="ml-3 font-semibold">Đang phát</span>
        <motion.div
          onContextMenu={(e) => {
            setSelectedTrack(queue[currentSongIndex]);
            displayMenu(e);
          }}
          whileTap={{ scale: 0.9 }}
          className="flex flex-row items-center py-2 hover:bg-base-300 rounded-md cursor-pointer group  mt-3"
        >
          <div
            className="relative ml-3"
            onClick={() => handlePlaySong(queue[currentSongIndex], playlist)}
          >
            <div className="absolute  right-0 top-0 w-12 h-12  rounded-md justify-center items-center hidden group-hover:bg-black/50 group-hover:flex">
              {isPlaying ? (
                <BsFillPauseFill color="white" />
              ) : (
                <BsFillPlayFill color="white" />
              )}
            </div>
            <img
              src={
                getThumbnail(queue[currentSongIndex]?.thumbnail, 1080) as string
              }
              alt={queue[currentSongIndex]?.title}
              width={48}
              height={48}
              className="rounded-lg"
            />
          </div>
          <div className="ml-2  flex flex-wrap flex-col flex-1">
            <p
              className="text-ellipsis line-clamp-1"
              style={{ color: "oklch(var(--p))" }}
            >
              {queue[currentSongIndex]?.title}
            </p>
            <p className="text-ellipsis line-clamp-1 text-base-content/40">
              {queue[currentSongIndex]?.artistsNames}
            </p>
          </div>
        </motion.div>
      </div>
      <div className="mt-4 w-full px-2">
        <div className="ml-3">
          {playlist.encodeId !== "" ? (
            <span className=" font-semibold">
              Tiếp theo từ:{" "}
              <Link to={playlist.link!}>
                <span className="underline">{playlist.title}</span>
              </Link>
            </span>
          ) : (
            <span>Tiếp theo</span>
          )}
        </div>
        {coppyQueue.map((track: any) => (
          <motion.div
            onContextMenu={(e) => {
              setSelectedTrack(track);
              displayMenu(e);
            }}
            key={track.encodeId}
            className="flex flex-row items-center py-2 hover:bg-base-300 rounded-md cursor-pointer group w-ful"
          >
            <div
              className="relative ml-3"
              onClick={() => handlePlaySong(track, playlist)}
            >
              <div className="absolute  right-0 top-0 w-12 h-12  rounded-md justify-center items-center hidden group-hover:bg-black/50 group-hover:flex">
                <BsFillPlayFill color="white" />
              </div>
              <img
                src={getThumbnail(track.thumbnail, 1080) as string}
                alt={track.title}
                width={48}
                height={48}
                className="rounded-lg"
              />
            </div>
            <div className="ml-2 flex flex-wrap flex-col flex-1">
              <p className="text-ellipsis line-clamp-1">{track.title}</p>
              <p className=" text-base-content/40 line-clamp-1 text-ellipsis">
                {track.artistsNames}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Queue;
