import { useAppSettingStore } from "../../store/AppSettingStore";
import { useUserStore } from "../../store/UserStore";
import {
  Add,
  CloseCircle,
  Edit,
  Heart,
  Home,
  SearchNormal,
} from "iconsax-react";
import { PiStack } from "react-icons/pi";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import PlaylistItem from "./components/PlaylistItem";

import { Menu, Item, useContextMenu } from "react-contexify";

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

  const { selectedPlaylist, setSelectedPlaylist } = useAppSettingStore();

  const handleDeletePlaylist = () => {
    if (inThisPlaylistId === selectedPlaylist.encodeId) {
      navigate("/");
    }
    toast.promise(deletePlaylist(selectedPlaylist.encodeId), {
      loading: "Đang xóa...",
      success: () => {
        setSelectedPlaylist(null);
        return "Đã xóa";
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
    <div
      className="flex flex-col"
      style={{
        width: isCollapseLibrary ? 80 : 350,
        minWidth: isCollapseLibrary ? 80 : 350,
      }}
    >
      <div className="rounded-lg bg-base-200 h-[12%] flex flex-col justify-between">
        <Link
          className="flex-row flex items-center flex-1 px-4"
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
            <span
              className={`${
                homeActive ? "text-base-content" : "text-base-content/70"
              } cursor-pointer ml-4 font-semibold`}
            >
              Trang chủ
            </span>
          )}
        </Link>
        <Link
          to={"/search"}
          className="flex-row flex items-center flex-1 px-4"
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
            <span
              className={`${
                searchActive ? "text-base-content" : "text-base-content/70"
              } cursor-pointer ml-4 font-semibold`}
            >
              Tìm kiếm
            </span>
          )}
        </Link>
      </div>
      <div className="rounded-lg bg-base-200 h-[86%] mt-2">
        <div className="flex flex-row sticky w-full top-0 z-[999] bg-base-200 px-4 py-4 rounded-lg">
          <div className="flex flex-row items-center gap-x-2 justify-between w-full">
            <div
              onClick={() => setIsCollapseLibrary(!isCollapseLibrary)}
              className={`flex flex-row items-center gap-x-2 group tooltip cursor-pointer w-full select-none h-8 ${
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
                className="group-hover:text-base-content text-base-content/70"
              />
              {!isCollapseLibrary && (
                <span
                  className={`font-semibold text-base-content/70 group-hover:text-base-content cursor-pointer select-none`}
                >
                  Thư viện của bạn
                </span>
              )}
            </div>
            {!isCollapseLibrary && (
              <div
                onClick={() => setCreatePlaylistModalVisible(true)}
                className="tooltip h-8 w-8 rounded-full hover:bg-base-100 flex justify-center items-center cursor-pointer"
                data-tip="Tạo danh sách phát"
              >
                <Add
                  size="24"
                  className="text-base-content/70 hover:text-base-content "
                />
              </div>
            )}
          </div>
        </div>

        <div className="px-2 w-full h-[88%] overflow-y-auto">
          <Link
            to={`/likedSongs`}
            className="flex flex-row items-center cursor-pointer w-full hover:bg-base-100 px-2 py-2 rounded-lg"
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
              <div
                style={{ height: 50, width: 50 }}
                className="bg-gradient-to-br from-primary to-secondary flex justify-center items-center"
              >
                <Heart size={40} variant="Bold" color="white" />
              </div>
            </div>
            {!isCollapseLibrary && (
              <div className="flex-1 flex ml-3 flex-col">
                <p className="text-base-content line-clamp-1 text-ellipsis">
                  {"Bài hát đã thích"}
                </p>
                <p className="text-base-content/70 text-sm">
                  {"Danh sách phát • " + likedSongs.length + " bài hát"}
                </p>
              </div>
            )}
          </Link>
          {myPlaylists.map((playlist) => (
            <div
              onContextMenu={(e) => {
                setSelectedPlaylist(playlist);
                displayMenu(e);
              }}
              key={playlist.encodeId}
            >
              <PlaylistItem key={playlist.encodeId} playlist={playlist} />
            </div>
          ))}
          {likedPlaylists.map((playlist) => (
            <Link
              onContextMenu={(e) => {
                setSelectedPlaylist(playlist);
                displayMenu(e);
              }}
              key={playlist.encodeId}
              to={`/playlist/${playlist.encodeId}`}
              className="flex flex-row items-center cursor-pointer w-full hover:bg-base-100 px-2 py-2 rounded-lg"
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
                <div style={{ height: 50, width: 50 }}>
                  <img
                    src={playlist?.thumbnail}
                    style={{ height: 50, width: 50 }}
                  />
                </div>
              </div>
              {!isCollapseLibrary && (
                <div className="flex-1 flex ml-3 flex-col">
                  <p className="text-base-content line-clamp-1 text-ellipsis">
                    {playlist?.title}
                  </p>
                  <p className="text-base-content/70 text-sm capitalize">
                    {playlist?.type === "album" ? "Album" : "Danh sách phát"} •{" "}
                    {playlist?.totalSong} bài hát
                  </p>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
      <Menu id={MENU_ID} theme="abc">
        <div className="flex flex-row items-center mb-2">
          {selectedPlaylist?.songs?.length > 0 ? (
            <RenderPlaylistThumbnail
              height={40}
              width={40}
              playlistLength={selectedPlaylist?.songs?.length}
              songs={selectedPlaylist?.songs}
            />
          ) : (
            <div style={{ height: 40, width: 40 }}>
              <img
                src={selectedPlaylist?.thumbnail}
                style={{ height: 40, width: 40 }}
              />
            </div>
          )}
          <div className="ml-2">
            <p>{selectedPlaylist?.title}</p>
            <p className="text-base-content/70 text-sm">
              {selectedPlaylist?.type === "album" ? "Album" : "Danh sách phát"}
            </p>
          </div>
        </div>
        {selectedPlaylist?.type === "myPlaylists" ? (
          <>
            <Item
              onClick={() =>
                (
                  document.getElementById("delete_modal") as HTMLDialogElement
                )?.showModal()
              }
            >
              <CloseCircle size={24} />
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
              <Edit size={24} />
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
            <CloseCircle size={24} />
            <span className="ml-2">Xoá Khỏi thư viện</span>
          </Item>
        )}
      </Menu>
      <DeletePlaylistModal onDelete={handleDeletePlaylist} />
      <EditPlaylistModal onEdit={handleEditPlaylist} />
    </div>
  );
};

export default LeftSideBar;
