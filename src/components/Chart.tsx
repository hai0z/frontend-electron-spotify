import { useQuery } from "@tanstack/react-query";
import { getChartHome } from "../services/MusicService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import getThumbnail from "../utils/getThumnail";
import { useAppSettingStore } from "../store/AppSettingStore";
import dayjs from "dayjs";
import { useTrackPlayerStore } from "../store/TrackPlayerStore";
import useTrackPlayer from "../hooks/useTrackPlayer";
import Lottie from "lottie-react";
import { BsFillPlayFill } from "react-icons/bs";
import PlayAnimation from "../assets/playing.json";
import { Link } from "react-router-dom";
const ChartComponent = () => {
  const { data } = useQuery({
    queryKey: ["chartHome"],
    queryFn: getChartHome,
  });
  const { isCollapseLibrary, queueVisible, nowPlayingVisible } =
    useAppSettingStore();

  const { currentSong, isPlaying } = useTrackPlayerStore();
  const { handlePlaySong } = useTrackPlayer();
  return (
    <div className="w-full">
      <div className="flex justify-between items-end text-[28px] font-bold  mt-9 mb-3 uppercase">
        <div className="px-4">Bảng xếp hạng</div>
        <Link
          to="/Chart"
          className="text-base-content/50 text-sm hover:underline cursor-pointer"
        >
          Xem thêm
        </Link>
      </div>
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        slidesPerView={
          (!isCollapseLibrary && queueVisible) || nowPlayingVisible ? 1.5 : 2.5
        }
      >
        {data?.RTChart?.items?.slice(0, 6).map((e: any, i: number) => (
          <SwiperSlide key={i}>
            <div className="flex flex-row bg-base-300 rounded-lg p-4 ml-4 group">
              <div className=" relative cursor-pointer">
                <div
                  className={`${
                    isPlaying && e.encodeId === currentSong?.encodeId
                      ? "absolute right-0 top-0 w-40 h-40 rounded-md justify-center items-center bg-black/50 flex"
                      : "absolute  right-0 top-0 w-40 h-40 rounded-md justify-center items-center hidden group-hover:bg-black/50 group-hover:flex "
                  }`}
                  onClick={() =>
                    handlePlaySong(e, {
                      encodeId: "Chart",
                      title: "Bảng xếp hạng",
                      songs: data.RTChart.items,
                      link: "/Chart",
                    })
                  }
                >
                  {isPlaying && e.encodeId === currentSong?.encodeId ? (
                    <Lottie animationData={PlayAnimation} />
                  ) : (
                    <BsFillPlayFill size={48} />
                  )}
                </div>
                <img
                  src={getThumbnail(e.thumbnail) as string}
                  alt=""
                  className="w-80 h-40 rounded-lg"
                />
              </div>
              <div className="ml-3 flex flex-col justify-between w-full">
                <div>
                  <p className="text-lg font-bold">{e.title}</p>
                  <p className="font-[500] text-base-content/50">
                    {e.artistsNames}
                  </p>
                </div>
                <div className="flex justify-between w-full items-center">
                  <p className="text-base-content/50 order">#{i + 1}</p>
                  <p className="text-base-content/50">
                    {dayjs.unix(e.releaseDate).format("DD/MM/YYYY")}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ChartComponent;
