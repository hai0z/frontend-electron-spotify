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
    <div className="w-full rounded-lg overflow-hidden mx-2 h-full relative">
      <motion.div
        key={currentSong?.encodeId}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        initial={{ opacity: 0 }}
        className="absolute top-0 left-0 w-full h-full animate-spin2"
        style={{
          backgroundImage: `url(${getThumbnail(currentSong?.thumbnail)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
          filter: "blur(100px) brightness(0.4)",
        }}
      ></motion.div>

      <div className="w-full h-full sticky top-0 pb-20 backdrop-blur-sm">
        <Header color={"transparent"} />
        <div
          onScroll={onScroll}
          className="justify-center items-center flex flex-col h-full flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent"
        >
          <div className="h-full flex flex-col max-w-4xl mx-auto w-full px-4">
            {currentSong?.hasLyric ? (
              lyric?.map(
                (
                  e: { data: string; startTime: number; endTime: number },
                  index: number
                ) => {
                  const isCurrentLine = e.startTime <= currentTime * 1000;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index < 10 ? index * 0.05 : 0.5 }}
                      id={`line-${index}`}
                      key={index}
                      className={`mx-0 px-6 rounded-xl transition-all duration-300 box-border py-4 ${
                        isCurrentLine ? "scale-105" : ""
                      }`}
                      onDoubleClick={() => {
                        if (auRef.current) {
                          auRef.current.currentTime = e.startTime / 1000;
                        }
                      }}
                    >
                      <span
                        className={`cursor-pointer inline-block text-[32px] font-bold select-none hover:opacity-100 transition-all duration-300 ${
                          isCurrentLine
                            ? "opacity-100 drop-shadow-glow"
                            : "opacity-40"
                        }`}
                      >
                        {e.data}
                      </span>
                    </motion.div>
                  );
                }
              )
            ) : (
              <div className="flex justify-center items-center flex-1 h-full w-full">
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                >
                  Lời bài hát chưa được cập nhật
                </motion.p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LyricPage;
