import { Menu, Item, Separator, Submenu } from "react-contexify";

import "react-contexify/dist/ReactContexify.css";
import { MENU_ID } from "../context/AppProvider";
import { useAppSettingStore } from "../store/AppSettingStore";
import useToggleLikeSong from "../hooks/useToggleLikeSong";
import { Link } from "react-router-dom";
import {
  AddCircle,
  HeartAdd,
  HeartRemove,
  MinusCirlce,
  ProfileCircle,
} from "iconsax-react";
import { useUserStore } from "../store/UserStore";
import {
  addSongToPlaylist,
  createPlaylist,
  removeSongFromPlaylist,
} from "../services/firebase";
import toast from "react-hot-toast";

export default function TrackContextMenu() {
  const { selectedTrack } = useAppSettingStore();

  const { myPlaylists, likedSongs } = useUserStore();

  const { isLiked, handleAddToLikedList } = useToggleLikeSong(
    selectedTrack?.encodeId
  );

  const playlistIncluded = myPlaylists.filter((pl: any) =>
    pl.songs.find((s: any) => s.encodeId == selectedTrack?.encodeId)
  );

  const likedSongIncluded = likedSongs.some(
    (s: any) => s.encodeId == selectedTrack?.encodeId
  );

  console.log(playlistIncluded);
  const playListNotIncluded = myPlaylists.filter(
    (pl: any) =>
      !pl.songs.find((s: any) => s.encodeId == selectedTrack?.encodeId)
  );
  const handleAddSongToPlaylist = (id: string) => {
    toast.promise(addSongToPlaylist(id, selectedTrack), {
      loading: "Đang thêm...",
      success: "Đã thêm",
      error: "Thêm thất bại",
    });
  };

  const handleCreatePlaylistWithSong = () => {
    const randomId = Math.random().toString(36).substring(7);
    toast.promise(
      createPlaylist({
        encodeId: randomId,
        title: selectedTrack?.title,
        thumbnail: selectedTrack?.thumbnail,
        songs: [selectedTrack],
        type: "myPlaylists",
      }),
      {
        loading: "Đang tạo...",
        success: "Đã tạo playlist",
        error: "Tạo playlist thất bại",
      }
    );
  };

  const handleRemoveSongFromPlaylist = () => {
    toast.promise(
      removeSongFromPlaylist(selectedTrack?.playlistId, selectedTrack),
      {
        loading: "Đang xóa...",
        success: "Đã xoá",
        error: "Xoá thất bại",
      }
    );
  };

  return (
    <div>
      <Menu id={MENU_ID} theme="abc" className="w-72">
        <div className="flex flex-row w-full items-center mb-1">
          <img
            src={selectedTrack?.thumbnail}
            alt=""
            className="w-10 h-10 mr-1"
          />
          <div>
            <p className="text-xs line-clamp-1">{selectedTrack?.title}</p>
            <p className="text-xs line-clamp-1">
              {selectedTrack?.artistsNames}
            </p>
          </div>
        </div>
        <Submenu
          label=<>
            <div className="flex flex-row items-center">
              <AddCircle size={24} />
              <span className="ml-2">Thêm vào danh sách phát</span>
            </div>
          </>
        >
          <div className="w-72 h-80">
            <div>
              <Item onClick={handleCreatePlaylistWithSong}>
                <AddCircle size={24} />
                <span className="ml-2">Tạo danh sách phát mới</span>
              </Item>
            </div>
            <Separator />
            {(playlistIncluded.length > 0 || likedSongIncluded) && (
              <div>
                <span className="ml-2 font-serif text-lg">Đã thêm vào</span>
                <div className="flex flex-col gap-1 mt-1">
                  {playlistIncluded.map((pl: any) => (
                    <Item key={pl.encodeId}>{pl.title}</Item>
                  ))}
                  {likedSongIncluded && <Item>Bài hát đã thích</Item>}
                </div>
                <Separator />
              </div>
            )}
            <div>
              <span className="ml-2 font-serif text-lg">Danh sách hiện có</span>
              <div className="flex flex-col gap-1 mt-1">
                {playListNotIncluded.map((pl: any) => (
                  <Item
                    key={pl.encodeId}
                    onClick={() => handleAddSongToPlaylist(pl.encodeId)}
                  >
                    {pl.title}
                  </Item>
                ))}
              </div>
            </div>
          </div>
        </Submenu>

        {!isLiked ? (
          <Item
            onClick={() => handleAddToLikedList(selectedTrack)}
            // className=" py-3 flex flex-row items-center"
          >
            <HeartAdd size={24} />
            <p className="ml-2">Thêm vào yêu thích</p>
          </Item>
        ) : (
          <Item onClick={() => handleAddToLikedList(selectedTrack)}>
            <HeartRemove size={24} />
            <p className="ml-2">Xoá khỏi yêu thích</p>
          </Item>
        )}
        {selectedTrack?.playlistId && (
          <Item onClick={handleRemoveSongFromPlaylist}>
            <MinusCirlce size={24} />
            <p className="ml-2">Xoá khỏi danh sách phát hiện tại</p>
          </Item>
        )}

        {selectedTrack?.artists.length > 0 &&
          (selectedTrack?.artists?.length >= 2 ? (
            <Submenu
              label=<>
                <div className="flex flex-row items-center">
                  <ProfileCircle size={24} />
                  <span className="ml-2">Chuyển đến nghệ sĩ</span>
                </div>
              </>
            >
              {selectedTrack?.artists.map((artist: any) => (
                <Link key={artist.encodeId} to={`/artist/${artist.alias}`}>
                  <Item>{artist.name}</Item>
                </Link>
              ))}
            </Submenu>
          ) : (
            <Link to={`/artist/${selectedTrack?.artists[0].alias}`}>
              <Item>
                <ProfileCircle size={24} />
                <span className="ml-2">Chuyển đến nghệ sĩ</span>
              </Item>
            </Link>
          ))}
      </Menu>
    </div>
  );
}
