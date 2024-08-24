import { useAppSettingStore } from "../../store/AppSettingStore";

const EditPlaylistModal = ({ onEdit }: { onEdit: (name: string) => void }) => {
  const { selectedPlaylist, setSelectedPlaylist } = useAppSettingStore();

  return (
    <dialog id="edit_playlist_modal" className={`modal`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Sửa danh sách phát</h3>
        <div className="mt-4">
          <input
            value={selectedPlaylist?.title}
            onChange={(e) =>
              setSelectedPlaylist({
                ...selectedPlaylist,
                title: e.target.value,
              })
            }
            type="text"
            autoFocus={true}
            placeholder="Tên danh sách phát"
            className="input input-bordered w-full max-w-full"
          />
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-outline mr-2">Huỷ</button>
            <button
              className="btn btn-primary"
              onClick={() => onEdit(selectedPlaylist?.title || "")}
            >
              Lưu
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default EditPlaylistModal;
