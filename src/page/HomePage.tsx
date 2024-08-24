import Header from "../components/Header";
import NewRelease from "../components/NewRelease";
import PlaylistCover from "../components/PlaylistCover";
import { useAppSettingStore } from "../store/AppSettingStore";
import { useUserStore } from "../store/UserStore";
import React, { useEffect } from "react";
import { getHome } from "../services/MusicService";
import { useQuery } from "@tanstack/react-query";
import RecentList from "../components/RecentList";
import Loading from "../components/Loading";
import ChartComponent from "../components/Chart";

interface typePlaylistCover {
  items: [];
  title: string;
  encodeId: string;
  thumbnail: string;
  sortDescription: string;
  sectionId: string;
}
const HomePage = () => {
  const { data: dataHome, isLoading } = useQuery({
    queryKey: ["home"],
    queryFn: async () => {
      const data = await getHome();
      return data.data;
    },
    refetchOnWindowFocus: false,
  });

  const {
    recentTrackColor,
    isCollapseLibrary,
    queueVisible,
    nowPlayingVisible,
  } = useAppSettingStore();

  const { recentList } = useUserStore();

  const containerRef = React.useRef<HTMLDivElement>(null);

  const [headerColor, setHeaderColor] = React.useState<string>("transparent");

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Chào buổi sáng";
    } else if (hour < 18) {
      return "Chào buổi chiều";
    } else {
      return "Chào buổi tối";
    }
  };

  useEffect(() => {
    const handleScroll = () => {};
    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      if (scrollTop > 50) {
        setHeaderColor("oklch(var(--b2))");
      } else {
        setHeaderColor("transparent");
      }
    }
  };
  if (isLoading) return <Loading />;
  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto flex flex-wrap rounded-lg bg-base-200 mx-2"
      onScroll={handleScroll}
    >
      <Header color={headerColor} />
      <main className="inset-0 box-border pb-[96px] w-full">
        <div
          className="px-4 relative -mt-16"
          style={{
            backgroundColor:
              recentList?.length >= 6 ? recentTrackColor : "transparent",
            transition: "background-color 1s ease-in-out",
          }}
        >
          <div className="pt-20">
            <span className="text-[28px] font-bold">{greeting()}</span>
            {recentList?.length >= 6 && (
              <div className="pt-2 pb-4">
                <div
                  className={`grid gap-x-6 gap-y-4 mt-4 ${
                    (!isCollapseLibrary && queueVisible) || nowPlayingVisible
                      ? "grid-cols-2"
                      : "grid-cols-3"
                  }`}
                >
                  <RecentList />
                </div>
                <div className="bg-gradient-to-t from-base-200 to-red-transparent h-full  bottom-0 absolute left-0 w-full z-1"></div>
              </div>
            )}
          </div>
        </div>
        <div className="px-4">
          <NewRelease
            data={
              dataHome?.items?.filter(
                (e: any) => e.sectionType === "new-release"
              )[0]
            }
          />
        </div>
        <div className=" w-full ">
          <ChartComponent />
        </div>

        {/* Playlist */}
        <div className="mt-8 px-4">
          {dataHome?.items
            ?.filter((item: any) => item.sectionType === "playlist")
            ?.map((e: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-end text-[28px] font-bold  mt-9 mb-3 uppercase">
                  {e.title === "" ? e.sectionId.slice(1) : e.title}
                </div>
                <div className="flex flex-row flex-wrap gap-x-6 gap-y-11">
                  {e.items.map((element: typePlaylistCover, index: number) => (
                    <div key={index}>
                      <PlaylistCover
                        title={element.title}
                        link={`/playlist/${element.encodeId}`}
                        thumbnail={element?.thumbnail}
                        sortDescription={element.sortDescription}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
        {/* End Playlist */}
      </main>
    </div>
  );
};

export default HomePage;
