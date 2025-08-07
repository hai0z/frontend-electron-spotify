import { useTrackPlayerStore } from "../store/TrackPlayerStore";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppContext } from "../context/AppProvider";
import caculateTime from "../utils/caculateTime";
import { TbMicrophone2 } from "react-icons/tb";
import { RxLoop, RxSpeakerLoud } from "react-icons/rx";
import { CgCompressRight } from "react-icons/cg";
import { BiShuffle, BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import useTrackPlayer from "../hooks/useTrackPlayer";
import logo from "../assets/sound.png";
import InputSlider from "react-input-slider";
import { useAppSettingStore } from "../store/AppSettingStore";
import useLyricIndex from "../hooks/useLyricIndex";
import use_local_auto_scroll from "../hooks/use_local_auto_scroll";
const FullScreenMode = () => {
  const {
    currentSong,
    currentTime,
    duration,
    isLoop,
    isShuffle,
    isPlaying,
    playlist,
    volume,
    setVolume,
    lyric,
    queue,
  } = useTrackPlayerStore();

  const { isFullScreenMode, setIsFullScreenMode, isShowLyric, setIsShowLyric } =
    useAppSettingStore();

  const fullscreenchange = () => {
    setIsFullScreenMode(document.fullscreenElement !== null);
  };

  const {
    toggleLoop,
    toggleShuffle,
    handlePlayPause,
    handlePrevSong,
    handleNextSong,
  } = useTrackPlayer();

  const { audioRef: auRef } = useContext(AppContext);

  useEffect(() => {
    document.addEventListener("fullscreenchange", fullscreenchange);

    return () => {
      document.removeEventListener("fullscreenchange", fullscreenchange);
    };
  }, []);

  const handleFullscreen = () => {
    document.exitFullscreen();
    setIsFullScreenMode(false);
  };

  const [trackPlayerControlVisible, setTrackPlayerControlVisible] =
    useState(true);

  const hideTimeoutRef = useRef<any>();

  const currentLine = useLyricIndex();

  const { onScroll, localAutoScroll } = use_local_auto_scroll({
    autoScroll: true,
    autoScrollAfterUserScroll: 2000,
  });

  useEffect(() => {
    if (localAutoScroll) {
      document.getElementById(`linef-${currentLine}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentLine, localAutoScroll, isShowLyric]);

  useEffect(() => {
    if (hideTimeoutRef.current !== null) {
      hideTimeoutRef.current = setTimeout(() => {
        setTrackPlayerControlVisible(false);
      }, 1000);
    }
    return () => clearTimeout(hideTimeoutRef?.current);
  }, []);

  useEffect(() => {
    const handleMouseMove = () => {
      setTrackPlayerControlVisible(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      if (hideTimeoutRef.current !== null) {
        hideTimeoutRef.current = setTimeout(() => {
          setTrackPlayerControlVisible(false);
        }, 1000);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    document
      .getElementById(`linef-0`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentSong?.encodeId]);

  const [showNextSong, setShowNextSong] = useState(false);

  const currentSongIndex = queue.findIndex(
    (e) => e.encodeId === currentSong?.encodeId
  );
  useLayoutEffect(() => {
    if (duration - currentTime < 20) {
      setShowNextSong(true);
    } else {
      setShowNextSong(false);
    }
  }, [currentTime]);
  return (
    isFullScreenMode && (
      <motion.div
        key={isFullScreenMode ? 1 : 0}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full h-screen absolute top-0 right-0 z-[999] flex flex-col items-center bg-base-200"
      >
        <motion.div
          key={currentSong?.encodeId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-0 w-[100vw] h-[100vw] bg-base-200 animate-spin2"
          style={{
            backgroundImage: `url(${currentSong?.thumbnail})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: -1,
            filter: "blur(200px) brightness(0.5)",
          }}
        ></motion.div>
        {showNextSong && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            key={showNextSong ? 1 : 0}
          >
            <div className=" bg-base-200 items-center border border-base-content fixed flex flex-row w-[350px] top-8 right-10">
              <div className="flex flex-row">
                <img
                  src={queue?.[currentSongIndex + 1]?.thumbnail as string}
                  alt="next-song"
                  className="w-16 h-16 object-cover"
                />
                <div className="flex flex-col flex-1 justify-center ml-2">
                  <span className="uppercase">Tiếp theo</span>
                  <span className="line-clamp-1 text-ellipsis">
                    {queue?.[currentSongIndex + 1]?.title} •{" "}
                    {queue?.[currentSongIndex + 1]?.artistsNames}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div className="h-20"></div>
        <AnimatePresence mode="wait">
          {isShowLyric ? (
            <motion.div
              className="self-start w-full h-4/5 px-24 mt-10  overflow-x-hidden overflow-y-hidden"
              key={isShowLyric ? 0 : 1}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="flex flex-row gap-x-4 items-center fixed  w-full top-8"
                style={{
                  transition: "background-color 1s",
                }}
              >
                <img
                  src={currentSong?.thumbnail}
                  className="w-16 h-16 object-cover"
                  alt="logo"
                />
                <div>
                  <p
                    style={{
                      transition: "color 1s",
                    }}
                    className="font-bold text-lg uppercase"
                  >
                    {currentSong?.title}
                  </p>
                  <p
                    style={{
                      transition: "color 1s",
                    }}
                    className="font-semibold"
                  >
                    {currentSong?.artistsNames}
                  </p>
                </div>
              </div>

              <div
                onScroll={onScroll}
                className="w-full flex justify-center items-center overflow-y-scroll h-full scroll-smooth full-screen-lyric"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="justify-center items-center h-full full-screen-lyric"
                  key={currentSong?.encodeId}
                >
                  {currentSong.hasLyric ? (
                    lyric.map(
                      (
                        e: {
                          data: string;
                          startTime: number;
                          endTime: number;
                        },
                        index: number
                      ) => {
                        return (
                          <div
                            id={`linef-${index}`}
                            key={index}
                            className={
                              "my-[2px] mx-0 py-3 rounded-xl transition-all duration-500 box-border text-center " +
                              (e.startTime <= currentTime * 1000 &&
                              currentTime * 1000 <= e.endTime
                                ? "scale-105"
                                : "")
                            }
                            onDoubleClick={() => {
                              if (auRef.current) {
                                auRef.current.currentTime = e.startTime / 1000;
                              }
                            }}
                          >
                            <span
                              style={{
                                transition: "color 1s",
                              }}
                              className={
                                "cursor-pointer inline-block text-[40px] font-bold select-none text-center " +
                                (e.startTime <= currentTime * 1000 &&
                                currentTime * 1000 <= e.endTime + 500
                                  ? "opacity-100 "
                                  : "opacity-50")
                              }
                            >
                              {e.data}
                            </span>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <div className="flex justify-center items-center flex-1 h-full w-full">
                      <p
                        style={{
                          transition: "color 1s",
                        }}
                        className="text-[28px] font-bold"
                      >
                        Lời bài hát chưa được cập nhật
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="w-full h-4/5 px-24 mt-10 justify-between flex-col flex"
              key={isShowLyric ? 0 : 1}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-row gap-x-4 items-center fixed top-8">
                <img src={logo} className="w-16 h-16 object-cover" alt="logo" />
                <div>
                  <p
                    style={{
                      transition: "color 1s",
                    }}
                    className="font-bold text-lg uppercase"
                  >
                    Đang phát từ playlist
                  </p>
                  <p
                    style={{
                      transition: "color 1s",
                    }}
                    className="font-semibold"
                  >
                    {playlist?.title}
                  </p>
                </div>
              </div>
              <div></div>
              <div className="flex flex-row gap-x-8 content-end">
                <motion.img
                  key={isShowLyric ? 0 : 1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={currentSong?.thumbnailM as string}
                  className="w-80 h-80 rounded-xl"
                />
                <div className="flex flex-col justify-end gap-y-2">
                  <p
                    style={{
                      transition: "color 1s",
                    }}
                    className="font-bold text-4xl"
                  >
                    {currentSong?.title}
                  </p>
                  <p
                    style={{
                      transition: "color 1s",
                    }}
                    className="font-semibold text-xl"
                  >
                    {currentSong?.artistsNames}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="w-full px-24 relative overflow-x-hidden"
          style={{
            height: "20%",
          }}
        >
          <div
            className="flex flex-row items-center justify-between gap-x-2 mt-4"
            style={{
              opacity: trackPlayerControlVisible ? 1 : 0,
              transition: "opacity 1s",
            }}
          >
            <div className="w-14 flex justify-center items-center">
              <span
                style={{
                  transition: "color 1s",
                }}
                className=" text-[12px] text-center font-bold text-lg"
              >
                {caculateTime(currentTime)}
              </span>
            </div>
            <InputSlider
              x={currentTime}
              xmin={0}
              xmax={duration}
              onChange={({ x }) => {
                if (auRef?.current) {
                  auRef.current.currentTime = Number(x);
                }
              }}
              axis="x"
              styles={{
                active: {
                  backgroundColor: "#fff",
                  transition: "background-color 1s",
                },
                track: {
                  backgroundColor: "#ffffff20",

                  transition: "background-color 1s",
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
              <span
                style={{
                  transition: "color 1s",
                }}
                className=" text-[12px] text-center font-bold text-lg"
              >
                {caculateTime(duration)}
              </span>
            </div>
          </div>
          <div
            className="w-full  items-center flex flex-row justify-between mt-4"
            style={{
              opacity: trackPlayerControlVisible ? 1 : 0,
              transition: "opacity 1s",
            }}
          >
            <div className="flex flex-1 bg-blue-500 opacity-0"></div>
            <div className="flex flex-row items-center mt-1 gap-4 flex-1  justify-center">
              <div
                className="rounded-full flex justify-center items-center cursor-pointer"
                onClick={toggleShuffle}
              >
                <BiShuffle
                  size={36}
                  style={{
                    color:
                      isShuffle == true
                        ? "oklch(var(--p))"
                        : "oklch(var(--bc))",
                    transition: "color 1s",
                  }}
                />
              </div>
              <div
                className="rounded-full flex justify-center items-center cursor-pointer"
                onClick={handlePrevSong}
              >
                <BiSkipPrevious size={60} style={{ transition: "color 1s" }} />
              </div>
              <div
                className="w-16 h-16 rounded-full flex justify-center items-center cursor-pointer"
                onClick={handlePlayPause}
              >
                {!isPlaying ? (
                  <BsFillPlayFill
                    size={48}
                    onClick={handlePlayPause}
                    style={{ transition: "color 1s" }}
                    color={"oklch(var(--bc))"}
                  />
                ) : (
                  <BsFillPauseFill
                    size={48}
                    onClick={handlePlayPause}
                    style={{ transition: "color 1s" }}
                    color={"oklch(var(--bc))"}
                  />
                )}
              </div>
              <div
                className="justify-center items-center cursor-pointer flex"
                onClick={handleNextSong}
              >
                <BiSkipNext size={60} />
              </div>
              <div
                className="rounded-full flex justify-center items-center cursor-pointer"
                onClick={toggleLoop}
              >
                <RxLoop
                  size={36}
                  style={{
                    color:
                      isLoop == true ? "oklch(var(--p))" : "oklch(var(--bc))",
                    transition: "color 1s",
                  }}
                />
              </div>
            </div>
            <div className="flex flex-row  items-center justify-end flex-1 h-16 ">
              <TbMicrophone2
                size={24}
                className="font-bold mr-4 cursor-pointer"
                style={{
                  color: isShowLyric ? "oklch(var(--p))" : "oklch(var(--bc))",
                  transition: "color 1s",
                }}
                onClick={() => {
                  setIsShowLyric(!isShowLyric);
                }}
              />
              <div className="gap-x-2 flex flex-row w-28 items-center">
                <RxSpeakerLoud className=" font-bold" size={24} />
                <InputSlider
                  axis="x"
                  x={volume}
                  xmin={0}
                  xmax={1}
                  xstep={0.01}
                  styles={{
                    active: {
                      backgroundColor: "oklch(var(--bc))",
                      transition: "background-color 1s",
                    },
                    track: {
                      backgroundColor: "#ffffff20",

                      width: "100%",
                      height: 4,
                      cursor: "pointer",
                      transition: "background-color 1s",
                    },
                    thumb: {
                      opacity: 0,
                      width: 10,
                      height: 10,
                    },
                  }}
                  onChange={({ x }) => {
                    if (auRef?.current) {
                      auRef.current.volume = x;
                      setVolume(x);
                    }
                  }}
                />
              </div>
              <div className="ml-4 cursor-pointer">
                <CgCompressRight
                  size={24}
                  onClick={handleFullscreen}
                  style={{ transition: "color 1s" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  );
};

export default FullScreenMode;
