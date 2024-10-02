import { createHashRouter, Outlet, RouterProvider } from "react-router-dom";
import AuthProvider, { useAuth } from "../context/AuthProvider";
import AppProvider from "../context/AppProvider";
import Frame from "../components/Frame";
import LeftSideBar from "../components/left-side-bar/LeftSideBar";
import Queue from "../components/Queue";
import MusicPlayer from "../components/MusicPlayer";
import FullScreenMode from "../components/FullScreenMode";
import LoginScreen from "../page/Login";
import PlaylistPage from "../page/Playlist";
import LyricPage from "../page/LyricPage";
import MyPlaylist from "../page/MyPlaylist";
import Header from "../components/Header";
import SearchInput from "../page/search/_components/SearchInput";
import SearchScreen from "../page/search/screen";
import LikedSongPage from "../page/LikedSong";
import NowPlaying from "../components/NowPlaying";
import CreatePlaylistModal from "../components/modal/CreatePlaylistModal";
import { Toaster } from "react-hot-toast";
import ArtistPage from "../page/ArtistPage";
import ArtistSong from "../page/ArtistSong";
import TrackContextMenu from "../components/TrackContextMenu";
import Setting from "../page/Setting";
import ChartPage from "../page/Chart";
import { motion } from "framer-motion";
import HomePage from "../page/HomePage";
import dayjs from "dayjs";
import Account from "../page/Account";

const VipAlert = () => {
  const { userData } = useAuth();
  console.log(userData);
  const isVip = dayjs.unix(userData?.vip?.expired?.seconds).isAfter(dayjs());

  return !isVip && userData !== null ? (
    <div className="toast toast-top toast-center z-[999] mt-10">
      <div className="alert alert-error">
        <span>Đăng kí VIP để tiếp tục nghe</span>
      </div>
    </div>
  ) : (
    <></>
  );
};
const MainLayout = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <VipAlert />
        <Frame />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex w-full flex-row h-[calc(100vh-110px)] pl-2"
        >
          <LeftSideBar />
          <Outlet />
          <Queue />
          <NowPlaying />
        </motion.div>
        <CreatePlaylistModal />
        <MusicPlayer />
        <FullScreenMode />
        <Toaster />
        <TrackContextMenu />
      </AppProvider>
    </AuthProvider>
  );
};
const SearchLayout = () => {
  return (
    <div className="w-full overflow-x-hidden rounded-lg  bg-base-200 mx-2">
      <Header content={<SearchInput />} color="oklch(var(--b2))" />
      <Outlet />
    </div>
  );
};
const router = createHashRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/account",
        element: <Account />,
      },
      {
        path: "/",
        id: "home",
        element: <HomePage />,
      },
      {
        path: "/playlist/:id",
        element: <PlaylistPage />,
      },
      {
        path: "/setting",
        element: <Setting />,
      },
      {
        path: "/Chart",
        element: <ChartPage />,
      },
      {
        path: "/myplaylist/:id",
        element: <MyPlaylist />,
      },
      {
        path: "/likedSongs",
        element: <LikedSongPage />,
      },
      {
        path: "/Artist/:name",
        element: <ArtistPage />,
      },
      {
        path: "/Artist-Song/:id/:name",
        element: <ArtistSong />,
      },
      {
        path: "/lyric",
        element: <LyricPage />,
      },
      {
        path: "/search",
        element: <SearchLayout />,
        children: [
          {
            path: "/search",
            element: <SearchScreen />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: (
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    ),
  },
]);
const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
