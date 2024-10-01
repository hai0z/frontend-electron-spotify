import { useTrackPlayerStore } from "../store/TrackPlayerStore";
import { useContext, useEffect } from "react";
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
    if (audioRef.current) {
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

  const isVip = dayjs.unix(userData?.vip?.expired?.seconds).isAfter(dayjs());
  return (
    <div className="w-full bg-base-300 h-20 absolute bottom-0 items-center flex flex-row justify-between px-4 z-50">
      <div className="flex flex-row items-center flex-1 ">
        {currentSong && (
          <motion.img
            key={currentSong?.encodeId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={getThumbnail(currentSong?.thumbnailM) as string}
            alt=""
            className="h-16 w-16 rounded-lg"
          />
        )}
        <div className="flex flex-col w-52">
          <span className=" ml-2 font-semibold line-clamp-1">
            {currentSong?.title}
          </span>

          <div className="ml-2 flex flex-row flex-1">
            {currentSong?.artists?.map((artist: any, index: number) => (
              <Link
                key={artist.alias}
                to={`/artist/${artist.alias}`}
                className={`text-[12px] hover:underline cursor-pointer line-clamp-1`}
              >
                {artist.name}
                {currentSong?.artists.length - 1 > index ? (
                  <span className="mr-1">, </span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
        <div className="ml-4">
          <ToggleLikeButton />
        </div>
      </div>
      <div className="flex flex-col items-center h-full pt-2 flex-1">
        <audio
          preload="auto"
          loop={isLoop}
          onEnded={handleNextSong}
          ref={audioRef}
          src={isVip ? currentSong?.url : null}
          onTimeUpdate={(e) => {
            if (audioRef?.current) {
              setCurrentTime(e.currentTarget.currentTime);
            }
          }}
          onLoadedData={(e) => {
            setDuration(e.currentTarget.duration);
          }}
        />
        <div className="flex flex-row items-center justify-between mt-1 gap-4">
          <div
            className="w-8 h-8  rounded-full flex justify-center items-center cursor-pointer"
            onClick={toggleShuffle}
          >
            <BiShuffle
              className="text-[24px]"
              style={{
                color:
                  isShuffle == true ? "oklch(var(--p))" : "oklch(var(--bc))",
              }}
            />
          </div>
          <div
            className="w-8 h-8 rounded-full flex justify-center items-center cursor-pointer"
            onClick={handlePrevSong}
          >
            <BiSkipPrevious className="text-[30px]" />
          </div>
          <div
            className="w-8 h-8 bg-base-content rounded-full flex justify-center items-center cursor-pointer"
            onClick={handlePlayPause}
          >
            {!isPlaying ? (
              <BsFillPlayFill
                className="text-[24px]"
                color="oklch(var(--b3))"
                onClick={handlePlayPause}
              />
            ) : (
              <BsFillPauseFill
                className="text-[24px]"
                color="oklch(var(--b3))"
                onClick={handlePlayPause}
              />
            )}
          </div>
          <div
            className="w-8 h-8 justify-center items-center cursor-pointer flex"
            onClick={handleNextSong}
          >
            <BiSkipNext className="text-[30px] bg-base" />
          </div>
          <div
            className="w-8 h-8 rounded-full flex justify-center items-center cursor-pointer"
            onClick={toggleLoop}
          >
            <RxLoop
              className="text-[24px]"
              style={{
                color: isLoop == true ? "oklch(var(--p))" : "oklch(var(--bc))",
              }}
            />
          </div>
        </div>
        <div className="flex flex-row justify-between items-center w-[500px] gap-2 mt-2">
          <div className="w-14  justify-center items-center flex">
            <span className=" text-[12px]">{caculateTime(currentTime)}</span>
          </div>
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
                backgroundColor: "oklch(var(--bc))",
              },
              track: {
                backgroundColor: "#ffffff20",
                width: "100%",
                height: 4,
                cursor: "pointer",
              },
              thumb: {
                width: 10,
                height: 10,
                opacity: 0,
              },
            }}
          />
          <div className="w-14  flex justify-center items-center">
            <span className=" text-[12px] text-center">
              {caculateTime(duration)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-row flex-1 items-center justify-end h-full">
        <div
          className="cursor-pointer"
          onClick={() => {
            setNowPlayingVisible(!nowPlayingVisible);
            setQueueVisible(false);
          }}
        >
          <LuPlaySquare
            size={20}
            className="mr-4"
            style={{
              color: nowPlayingVisible ? "oklch(var(--p))" : "oklch(var(--bc))",
            }}
          />
        </div>
        {(currentSong?.hasLyric || pathName === "/lyric") && (
          <TbMicrophone2
            size={20}
            className="font-bold mr-4 cursor-pointer"
            style={{
              color:
                pathName === "/lyric" ? "oklch(var(--p))" : "oklch(var(--bc))",
            }}
            onClick={() => {
              if (pathName !== "/lyric") {
                setIsShowLyric(true);
                navigate("/lyric");
              } else {
                navigate(-1);
                setIsShowLyric(false);
              }
            }}
          />
        )}
        <div
          onClick={() => {
            setQueueVisible(!queueVisible);
            setNowPlayingVisible(false);
          }}
        >
          <HiOutlineQueueList
            size={20}
            className="mr-4 cursor-pointer"
            style={{
              color: queueVisible ? "oklch(var(--p))" : "oklch(var(--bc))",
            }}
          />
        </div>
        <div className="flex flex-row items-center w-28 gap-x-2">
          <RxSpeakerLoud className=" font-bold" size={20} />
          <InputSlider
            axis="x"
            x={volume}
            xmin={0}
            xmax={1}
            xstep={0.01}
            styles={{
              active: {
                backgroundColor: "oklch(var(--bc))",
              },
              track: {
                backgroundColor: "#ffffff20",
                width: "100%",
                height: 4,
                cursor: "pointer",
              },
              thumb: {
                opacity: 0,
                width: 10,
                height: 10,
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
        <div className="ml-4 cursor-pointer" onClick={handleFullscreen}>
          <CgArrowsExpandRight size={20} />
        </div>
      </div>
    </div>
  );
}

export default Player;
