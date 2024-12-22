import { useTrackPlayerStore } from "../store/TrackPlayerStore";
import { memo, useContext, useEffect, useMemo } from "react";
import { BiShuffle, BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { RxLoop, RxSpeakerLoud } from "react-icons/rx";
import { TbMicrophone2 } from "react-icons/tb";
import { HiOutlineQueueList } from "react-icons/hi2";
import { CgArrowsExpandRight } from "react-icons/cg";
import getThumbnail from "../utils/getThumnail";
import { AppContext } from "../context/AppProvider";
import caculateTime from "../utils/caculateTime";
import useTrackPlayer from "../hooks/useTrackPlayer";
import { motion } from "framer-motion";
import InputSlider from "react-input-slider";
import { useAppSettingStore } from "../store/AppSettingStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuPlaySquare } from "react-icons/lu";
import ToggleLikeButton from "./ToggleLikeButton";
import { useAuth } from "../context/AuthProvider";
import dayjs from "dayjs";

function Player() {
  const { userData } = useAuth();
  const {
    isPlaying,
    currentSong,
    isLoop,
    isShuffle,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    volume,
    setVolume,
  } = useTrackPlayerStore();

  const {
    queueVisible,
    setQueueVisible,
    setIsFullScreenMode,
    setIsShowLyric,
    nowPlayingVisible,
    setNowPlayingVisible,
  } = useAppSettingStore();
  const { audioRef } = useContext(AppContext);

  const pathName = useLocation().pathname;
  const navigate = useNavigate();
  const {
    handleNextSong,
    handlePrevSong,
    toggleLoop,
    toggleShuffle,
    handlePlayPause,
  } = useTrackPlayer();
  const handleFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
      setIsFullScreenMode(true);
    }
  };

  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.volume = volume;
      audioRef.current.currentTime = currentTime;
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audioRef?.current?.play();
    } else {
      audioRef?.current?.pause();
    }
  }, [isPlaying, currentSong]);

  const isVip = useMemo(() => {
    return dayjs.unix(userData?.vip?.expired?.seconds).isAfter(dayjs());
  }, [userData]);

  const { youtubeUrlLoading } = useContext(AppContext);
  return (
    <div className="w-full bg-gradient-to-b from-base-300 to-base-200 h-24 absolute bottom-0 items-center flex flex-row justify-between px-6 z-50 shadow-lg">
      <div className="flex flex-row items-center flex-1 gap-4">
        {currentSong && (
          <motion.div
            key={currentSong?.encodeId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative group"
          >
            <img
              src={currentSong?.thumbnailM}
              alt=""
              className="h-16 w-16 rounded-xl shadow-md transition-transform group-hover:scale-105 object-contain"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center">
              <BsFillPlayFill className="text-3xl text-white" />
            </div>
          </motion.div>
        )}
        <div className="flex flex-col w-60">
          <span className="font-bold text-base line-clamp-1 hover:text-primary transition-colors">
            {currentSong?.title}
          </span>
          <div className="flex flex-row flex-1">
            {currentSong?.artists?.map((artist: any, index: number) => (
              <Link
                key={artist.alias}
                to={`/artist/${artist.alias}`}
                className="text-sm hover:text-primary transition-colors line-clamp-1"
              >
                {artist.name}
                {currentSong?.artists.length - 1 > index ? (
                  <span className="mx-1">, </span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
        <div className="ml-2">
          <ToggleLikeButton />
        </div>
      </div>

      <div className="flex flex-col items-center h-full justify-center flex-1 gap-2">
        <audio
          preload="auto"
          loop={isLoop}
          onEnded={handleNextSong}
          ref={audioRef}
          src={isVip ? currentSong?.url : ""}
          onTimeUpdate={(e) => {
            if (audioRef?.current) {
              setCurrentTime(e.currentTarget.currentTime);
            }
          }}
          onLoadedData={(e) => {
            setDuration(e.currentTarget.duration);
          }}
        />
        <div className="flex flex-row items-center justify-center gap-6">
          <button
            className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-base-content/10 transition-colors"
            onClick={toggleShuffle}
          >
            <BiShuffle
              className="text-2xl transition-colors"
              style={{
                color: isShuffle ? "oklch(var(--p))" : "oklch(var(--bc))",
              }}
            />
          </button>
          <button
            className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-base-content/10 transition-colors"
            onClick={handlePrevSong}
          >
            <BiSkipPrevious className="text-3xl" />
          </button>
          <button
            className="w-12 h-12 bg-primary rounded-full flex justify-center items-center hover:bg-primary-focus transition-colors shadow-lg"
            onClick={handlePlayPause}
          >
            {youtubeUrlLoading ? (
              <div className="w-12 h-12 bg-primary rounded-full flex justify-center items-center hover:bg-primary-focus transition-colors shadow-lg">
                <div className="loading loading-spinner loading-sm text-primary-content"></div>
              </div>
            ) : !isPlaying ? (
              <BsFillPlayFill className="text-2xl text-primary-content" />
            ) : (
              <BsFillPauseFill className="text-2xl text-primary-content" />
            )}
          </button>
          <button
            className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-base-content/10 transition-colors"
            onClick={handleNextSong}
          >
            <BiSkipNext className="text-3xl" />
          </button>
          <button
            className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-base-content/10 transition-colors"
            onClick={toggleLoop}
          >
            <RxLoop
              className="text-2xl transition-colors"
              style={{
                color: isLoop ? "oklch(var(--p))" : "oklch(var(--bc))",
              }}
            />
          </button>
        </div>
        <div className="flex flex-row justify-between items-center w-[500px] gap-3">
          <span className="text-xs w-12 text-center">
            {caculateTime(currentTime)}
          </span>
          <InputSlider
            x={currentTime}
            xmin={0}
            xmax={duration}
            onChange={({ x }) => {
              if (audioRef?.current) {
                audioRef.current.currentTime = Number(x);
              }
            }}
            axis="x"
            styles={{
              active: {
                backgroundColor: "oklch(var(--p))",
              },
              track: {
                backgroundColor: "oklch(var(--bc)/.2)",
                width: "100%",
                height: 4,
                cursor: "pointer",
              },
              thumb: {
                width: 12,
                height: 12,
                backgroundColor: "oklch(var(--p))",
                opacity: 1,
                transition: "transform 0.2s",
                ":hover": {
                  transform: "scale(1.2)",
                },
              },
            }}
          />
          <span className="text-xs w-12 text-center">
            {caculateTime(duration)}
          </span>
        </div>
      </div>

      <div className="flex flex-row flex-1 items-center justify-end gap-6">
        <button
          className="hover:text-primary transition-colors"
          onClick={() => {
            setNowPlayingVisible(!nowPlayingVisible);
            setQueueVisible(false);
          }}
        >
          <LuPlaySquare
            size={22}
            style={{
              color: nowPlayingVisible ? "oklch(var(--p))" : "currentColor",
            }}
          />
        </button>

        {(currentSong?.hasLyric || pathName === "/lyric") && (
          <button
            className="hover:text-primary transition-colors"
            onClick={() => {
              if (pathName !== "/lyric") {
                setIsShowLyric(true);
                navigate("/lyric");
              } else {
                navigate(-1);
                setIsShowLyric(false);
              }
            }}
          >
            <TbMicrophone2
              size={22}
              style={{
                color:
                  pathName === "/lyric" ? "oklch(var(--p))" : "currentColor",
              }}
            />
          </button>
        )}

        <button
          className="hover:text-primary transition-colors"
          onClick={() => {
            setQueueVisible(!queueVisible);
            setNowPlayingVisible(false);
          }}
        >
          <HiOutlineQueueList
            size={22}
            style={{
              color: queueVisible ? "oklch(var(--p))" : "currentColor",
            }}
          />
        </button>

        <div className="flex flex-row items-center gap-3 w-32">
          <RxSpeakerLoud size={22} />
          <InputSlider
            axis="x"
            x={volume}
            xmin={0}
            xmax={1}
            xstep={0.01}
            styles={{
              active: {
                backgroundColor: "oklch(var(--p))",
              },
              track: {
                backgroundColor: "oklch(var(--bc)/.2)",
                width: "100%",
                height: 4,
                cursor: "pointer",
              },
              thumb: {
                width: 12,
                height: 12,
                backgroundColor: "oklch(var(--p))",
                opacity: 1,
                transition: "transform 0.2s",
                ":hover": {
                  transform: "scale(1.2)",
                },
              },
            }}
            onChange={({ x }) => {
              if (audioRef?.current) {
                audioRef.current.volume = x;
                setVolume(x);
              }
            }}
          />
        </div>

        <button
          className="hover:text-primary transition-colors"
          onClick={handleFullscreen}
        >
          <CgArrowsExpandRight size={22} />
        </button>
      </div>
    </div>
  );
}

export default memo(Player);
