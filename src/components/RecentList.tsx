"use client";
import { useAppContext } from "../context/AppProvider";
import useImageColor from "../hooks/useImageColor";
import useTrackPlayer from "../hooks/useTrackPlayer";
import { useAppSettingStore } from "../store/AppSettingStore";
import { useTrackPlayerStore } from "../store/TrackPlayerStore";
import { useUserStore } from "../store/UserStore";
import { getImageColor } from "../utils/getImageColor";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";

const RecentList = () => {
  const { currentSong, isPlaying } = useTrackPlayerStore();
  const { recentList } = useUserStore();
  const { handlePlaySong } = useTrackPlayer();
  const { setRecentTrackColor, setSelectedTrack } = useAppSettingStore();

  const { displayMenu } = useAppContext();

  return (
    <>
      {recentList?.slice(0, 6).map((item: any, index: number) => (
        <div
          onContextMenu={(e) => {
            setSelectedTrack(item);
            displayMenu(e);
          }}
          onMouseEnter={async () => {
            setRecentTrackColor(
              useImageColor(
                (await getImageColor(item?.thumbnail as string)) as string
              )
            );
          }}
          onMouseLeave={() => setRecentTrackColor("transparent")}
          key={index}
          className="flex flex-row w-full items-center rounded-md cursor-pointer justify-between group bg-base-300 hover:bg-neutral/50 z-[2]"
        >
          <div className="flex flex-row items-center w-full flex-1 mr-2">
            <img
              src={item?.thumbnail}
              alt="playyyy"
              className="object-cover h-16 w-16 rounded-tl-md rounded-bl-md"
            />
            <span className="text-[16px] font-bold ml-2 line-clamp-2">
              {item?.title}
            </span>
          </div>
          <div>
            <div
              onClick={() => {
                handlePlaySong(item, {
                  encodeId: "",
                  title: "Nghe gần đây",
                  songs: recentList,
                  link: "#",
                });
              }}
              className={`bg-primary w-12 h-12 rounded-full mr-4  justify-center items-center  transition-all duration-200 opacity-0 group-hover:opacity-100 flex hover:scale-105 shadow-sm ${
                currentSong?.encodeId === item?.encodeId &&
                isPlaying &&
                "opacity-100"
              }`}
            >
              {isPlaying && item?.encodeId === currentSong?.encodeId ? (
                <BsFillPauseFill className="text-primary-content text-[24px]" />
              ) : (
                <BsFillPlayFill className="text-primary-content text-[24px]" />
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default RecentList;
