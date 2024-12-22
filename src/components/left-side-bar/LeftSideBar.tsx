import { useAppSettingStore } from "../../store/AppSettingStore";
import { useUserStore } from "../../store/UserStore";
import {
  Add,
  CloseCircle,
  Edit,
  Heart,
  Home,
  SearchNormal,
  Youtube,
} from "iconsax-react";
import { PiStack } from "react-icons/pi";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import PlaylistItem from "./components/PlaylistItem";
import { Menu, Item, useContextMenu } from "react-contexify";
import { motion, AnimatePresence } from "framer-motion";
import "react-contexify/dist/ReactContexify.css";
import toast from "react-hot-toast";
import {
  addToLikedPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../../services/firebase";
import RenderPlaylistThumbnail from "../PlaylistThumbnail";
import DeletePlaylistModal from "../modal/DeletePlaylistModal";
import EditPlaylistModal from "../modal/EditPlaylistModal";

const MENU_ID = "PLAYLIST_ITEM";

const LeftSideBar = () => {
  const pathName = useLocation().pathname;
  const homeActive = pathName === "/";
  const { id: inThisPlaylistId } = useParams();
  const navigate = useNavigate();
  const searchActive = pathName.includes("search");
  const youtubeActive = pathName.includes("youtube");
  const { selectedPlaylist, setSelectedPlaylist } = useAppSettingStore();

  const handleDeletePlaylist = () => {
    if (inThisPlaylistId === selectedPlaylist.encodeId) {
      navigate("/");
    }
    toast.promise(deletePlaylist(selectedPlaylist.encodeId), {
      loading: "Đang xóa...",
      success: () => {
        setSelectedPlaylist(null);
        return "Đã xóa";
      },
      error: (err) => err.message,
    });
  };

  const handleEditPlaylist = (name: string) => {
    toast.promise(
      updatePlaylist({
        ...selectedPlaylist,
        title: name,
      }),
      {
        loading: "Đang sửa...",
        success: () => {
          setSelectedPlaylist(null);
          return "Sửa thành công";
        },
        error: (err) => err.message,
      }
    );
  };

  const {
    isCollapseLibrary,
    setIsCollapseLibrary,
    setCreatePlaylistModalVisible,
  } = useAppSettingStore();

  const { myPlaylists, likedPlaylists, likedSongs } = useUserStore();
  const { show } = useContextMenu({
    id: MENU_ID,
  });

  function displayMenu(e: any) {
    show({
      event: e,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col"
      style={{
        width: isCollapseLibrary ? 80 : 350,
        minWidth: isCollapseLibrary ? 80 : 350,
      }}
    >
      <motion.div className="rounded-lg bg-base-200 backdrop-blur-md h-[15%] flex flex-col justify-between ">
        <Link
          className="flex-row flex items-center flex-1 px-4 transition-all duration-200 hover:bg-base-300/50 rounded-t-lg"
          to={"/"}
          style={{
            justifyContent: isCollapseLibrary ? "center" : "flex-start",
          }}
        >
          <Home
            size={24}
            color={homeActive ? "oklch(var(--bc))" : "oklch(var(--bc)/0.7)"}
            variant={homeActive ? "Bold" : "Outline"}
          />
          {!isCollapseLibrary && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${
                homeActive ? "text-base-content" : "text-base-content/70"
              } cursor-pointer ml-4 font-semibold`}
            >
              Trang chủ
            </motion.span>
          )}
        </Link>
        <Link
          to={"/search"}
          className="flex-row flex items-center flex-1 px-4 transition-all duration-200 hover:bg-base-300/50 rounded-b-lg"
          style={{
            justifyContent: isCollapseLibrary ? "center" : "flex-start",
          }}
        >
          <SearchNormal
            size={24}
            variant={searchActive ? "Bold" : "Outline"}
            color={searchActive ? "oklch(var(--bc))" : "oklch(var(--bc)/0.7)"}
          />
          {!isCollapseLibrary && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${
                searchActive ? "text-base-content" : "text-base-content/70"
              } cursor-pointer ml-4 font-semibold`}
            >
              Tìm kiếm
            </motion.span>
          )}
        </Link>
        <Link
          to={"/youtube"}
          className="flex-row flex items-center flex-1 px-4 transition-all duration-200 hover:bg-base-300/50 rounded-b-lg"
          style={{
            justifyContent: isCollapseLibrary ? "center" : "flex-start",
          }}
        >
          <Youtube
            size={24}
            variant={youtubeActive ? "Bold" : "Outline"}
            color={youtubeActive ? "oklch(var(--bc))" : "oklch(var(--bc)/0.7)"}
          />
          {!isCollapseLibrary && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${
                youtubeActive ? "text-base-content" : "text-base-content/70"
              } cursor-pointer ml-4 font-semibold`}
            >
              Youtube Music
            </motion.span>
          )}
        </Link>
      </motion.div>

      <motion.div
        className="rounded-lg bg-base-200 backdrop-blur-md h-[80%] mt-2 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-row sticky w-full top-0 z-[999] bg-base-200 backdrop-blur-md px-4 py-4 rounded-lg">
          <div className="flex flex-row items-center gap-x-2 justify-between w-full">
            <motion.div
              onClick={() => setIsCollapseLibrary(!isCollapseLibrary)}
              className={`flex flex-row items-center gap-x-2 group z-50 tooltip cursor-pointer w-full select-none h-8 ${
                isCollapseLibrary ? "tooltip-right" : "tooltip-top"
              }`}
              style={{
                justifyContent: isCollapseLibrary ? "center" : "flex-start",
              }}
              data-tip={
                !isCollapseLibrary
                  ? "Thu gọn thư viện của bạn"
                  : "Mở rộng thư viện của bạn"
              }
            >
              <PiStack
                size={24}
                className="group-hover:text-base-content text-base-content/70 transition-colors duration-200"
              />
              {!isCollapseLibrary && (
                <span
                  className={`font-semibold text-base-content/70 group-hover:text-base-content cursor-pointer select-none transition-colors duration-200`}
                >
                  Thư viện của bạn
                </span>
              )}
            </motion.div>
            {!isCollapseLibrary && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                onClick={() => setCreatePlaylistModalVisible(true)}
                className="tooltip h-8 w-8 rounded-full hover:bg-base-100 flex justify-center items-center cursor-pointer transition-all duration-200"
                data-tip="Tạo danh sách phát"
              >
                <Add
                  size="24"
                  className="text-base-content/70 hover:text-base-content transition-colors duration-200"
                />
              </motion.div>
            )}
          </div>
        </div>

        <div className="px-2 w-full h-[88%] overflow-y-auto custom-scrollbar">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to={`/likedSongs`}
                className="flex flex-row items-center cursor-pointer w-full hover:bg-base-100 px-2 py-2 rounded-lg transition-all duration-200"
                style={{
                  justifyContent: isCollapseLibrary ? "center" : "flex-start",
                }}
              >
                <div
                  style={{
                    flex: isCollapseLibrary ? 1 : "none",
                    display: "flex",
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    style={{ height: 50, width: 50 }}
                    className="bg-gradient-to-br from-primary to-secondary flex justify-center items-center rounded-lg shadow-lg"
                  >
                    <Heart size={40} variant="Bold" color="white" />
                  </motion.div>
                </div>
                {!isCollapseLibrary && (
                  <div className="flex-1 flex ml-3 flex-col">
                    <p className="text-base-content line-clamp-1 text-ellipsis font-medium">
                      {"Bài hát đã thích"}
                    </p>
                    <p className="text-base-content/70 text-sm">
                      {"Danh sách phát • " + likedSongs.length + " bài hát"}
                    </p>
                  </div>
                )}
              </Link>

              {myPlaylists.map((playlist, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={playlist.encodeId}
                  onContextMenu={(e) => {
                    setSelectedPlaylist(playlist);
                    displayMenu(e);
                  }}
                >
                  <PlaylistItem playlist={playlist} />
                </motion.div>
              ))}

              {likedPlaylists.map((playlist, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (myPlaylists.length + index) * 0.1 }}
                  key={playlist.encodeId}
                >
                  <Link
                    onContextMenu={(e) => {
                      setSelectedPlaylist(playlist);
                      displayMenu(e);
                    }}
                    to={`/playlist/${playlist.encodeId}`}
                    className="flex flex-row items-center cursor-pointer w-full hover:bg-base-100 px-2 py-2 rounded-lg transition-all duration-200"
                    style={{
                      justifyContent: isCollapseLibrary
                        ? "center"
                        : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        flex: isCollapseLibrary ? 1 : "none",
                        display: "flex",
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="rounded-lg overflow-hidden shadow-md"
                        style={{ height: 50, width: 50 }}
                      >
                        <img
                          src={playlist?.thumbnail}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          style={{ height: 50, width: 50 }}
                        />
                      </motion.div>
                    </div>
                    {!isCollapseLibrary && (
                      <div className="flex-1 flex ml-3 flex-col">
                        <p className="text-base-content line-clamp-1 text-ellipsis font-medium hover:text-primary transition-colors">
                          {playlist?.title}
                        </p>
                        <p className="text-base-content/70 text-sm capitalize">
                          {playlist?.type === "album"
                            ? "Album"
                            : "Danh sách phát"}{" "}
                          • {playlist?.totalSong} bài hát
                        </p>
                      </div>
                    )}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <Menu id={MENU_ID} theme="abc">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-row items-center mb-2 p-2 rounded-lg hover:bg-base-200/50"
        >
          {selectedPlaylist?.songs?.length > 0 ? (
            <RenderPlaylistThumbnail
              height={40}
              width={40}
              playlistLength={selectedPlaylist?.songs?.length}
              songs={selectedPlaylist?.songs}
            />
          ) : (
            <div
              className="rounded-lg overflow-hidden"
              style={{ height: 40, width: 40 }}
            >
              <img
                src={selectedPlaylist?.thumbnail}
                className="w-full h-full object-cover"
                style={{ height: 40, width: 40 }}
              />
            </div>
          )}
          <div className="ml-2">
            <p className="font-medium">{selectedPlaylist?.title}</p>
            <p className="text-base-content/70 text-sm">
              {selectedPlaylist?.type === "album" ? "Album" : "Danh sách phát"}
            </p>
          </div>
        </motion.div>
        {selectedPlaylist?.type === "myPlaylists" ? (
          <>
            <Item
              onClick={() =>
                (
                  document.getElementById("delete_modal") as HTMLDialogElement
                )?.showModal()
              }
            >
              <CloseCircle size={24} className="text-red-500" />
              <span className="ml-2">Xoá danh sách phát</span>
            </Item>
            <Item
              onClick={() =>
                (
                  document.getElementById(
                    "edit_playlist_modal"
                  ) as HTMLDialogElement
                )?.showModal()
              }
            >
              <Edit size={24} className="text-primary" />
              <span className="ml-2">Sửa danh sách phát</span>
            </Item>
          </>
        ) : (
          <Item
            onClick={() =>
              addToLikedPlaylist({
                encodeId: selectedPlaylist?.encodeId,
              })
            }
          >
            <CloseCircle size={24} className="text-red-500" />
            <span className="ml-2">Xoá Khỏi thư viện</span>
          </Item>
        )}
      </Menu>
      <DeletePlaylistModal onDelete={handleDeletePlaylist} />
      <EditPlaylistModal onEdit={handleEditPlaylist} />
    </motion.div>
  );
};

export default LeftSideBar;
