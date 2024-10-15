import { AppContext } from "../context/AppProvider";
import { useTrackPlayerStore } from "../store/TrackPlayerStore";
import React, { useEffect } from "react";
import Header from "../components/Header";
import useLyricIndex from "../hooks/useLyricIndex";
import use_local_auto_scroll from "../hooks/use_local_auto_scroll";
import getThumbnail from "../utils/getThumnail";
import { motion } from "framer-motion";
const LyricPage = () => {
  const { lyric, currentTime, currentSong } = useTrackPlayerStore();
  const { audioRef: auRef } = React.useContext(AppContext);

  const currentLine = useLyricIndex();

  const { onScroll, localAutoScroll } = use_local_auto_scroll({
    autoScroll: true,
    autoScrollAfterUserScroll: 2000,
  });

  useEffect(() => {
    if (localAutoScroll) {
      document.getElementById(`line-${currentLine}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentLine, localAutoScroll]);

  useEffect(() => {
    document
      .getElementById(`line-0`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentSong?.encodeId]);

  return (
    <div className="w-full rounded-md overflow-hidden mx-2 h-full relative">
      <motion.div
        key={currentSong?.encodeId}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        initial={{ opacity: 0 }}
        className="absolute top-0 left-0 w-full h-full bg-base-200"
        style={{
          backgroundImage: `url(${getThumbnail(currentSong?.thumbnail)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
          filter: "blur(120px) brightness(0.5)",
        }}
      ></motion.div>
      <div className="w-full h-full sticky top-0 pb-20">
        <Header color={"transparent"} />
        <div
          onScroll={onScroll}
          className="justify-center items-center flex flex-col h-full flex-1 overflow-y-scroll "
        >
          <div className="h-full flex flex-col">
            {currentSong?.hasLyric ? (
              lyric?.map(
                (
                  e: { data: string; startTime: number; endTime: number },
                  index: number
                ) => {
                  return (
                    <div
                      id={`line-${index}`}
                      key={index}
                      className={
                        "mx-0 px-[18px] rounded-xl transition-all duration-500 box-border py-3"
                      }
                      onDoubleClick={() => {
                        if (auRef.current) {
                          auRef.current.currentTime = e.startTime / 1000;
                        }
                      }}
                    >
                      <span
                        className={
                          "cursor-pointer inline-block text-[28px]  font-bold select-none hover:opacity-100 " +
                          (e.startTime <= currentTime * 1000
                            ? "opacity-100  drop-shadow-2xl"
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
                <p className="text-[28px] font-bold">
                  Lời bài hát chưa được cập nhật
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LyricPage;
