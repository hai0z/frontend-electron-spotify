import toast from "react-hot-toast";
import { useAppSettingStore } from "../../store/AppSettingStore";
import { createPlaylist } from "../../services/firebase";
import { useState } from "react";
import { DEFAULT_IMG } from "../../constants";

const CreatePlaylistModal = () => {
  const { setCreatePlaylistModalVisible, createPlaylistModalVisible } =
    useAppSettingStore();

  const [playlistName, setPlaylistName] = useState("");

  const handleCreatePlaylist = async () => {
    if (playlistName.trim().length === 0) {
      toast.error("Vui lòng nhập tên danh sách phát");
    } else {
      const playlist = {
        encodeId: Math.random().toString(36).substring(3),
        title: playlistName,
        thumbnail: DEFAULT_IMG,
        songs: [],
        type: "myPlaylists",
      };
      toast.promise(createPlaylist(playlist), {
        loading: "Đang tạo...",
        success: () => {
          setPlaylistName("");
          setCreatePlaylistModalVisible(false);

          return "Đã tạo danh sách phát";
        },
        error: (err) => err.message,
      });
    }
  };

  return (
    <dialog
      id="my_modal_1"
      className={`modal ${createPlaylistModalVisible && "modal-open"}`}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">Tạo danh sách phát</h3>
        <div className="mt-4">
          <input
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            type="text"
            autoFocus={true}
            placeholder="Tên danh sách phát"
            className="input input-bordered w-full max-w-full"
          />
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button
              className="btn btn-outline"
              onClick={() => setCreatePlaylistModalVisible(false)}
            >
              Huỷ
            </button>
          </form>
          <button className="btn btn-primary" onClick={handleCreatePlaylist}>
            Tạo danh sách phát
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default CreatePlaylistModal;
