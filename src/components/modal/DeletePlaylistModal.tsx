const DeletePlaylistModal = ({ onDelete }: { onDelete: () => void }) => {
  return (
    <dialog id="delete_modal" className={`modal`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Cảnh báo</h3>
        <div className="mt-4">
          <p>Bạn có muốn xoá danh sách phát này?</p>
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-outline mr-2">Huỷ</button>
            <button className="btn btn-error" onClick={onDelete}>
              Xoá
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default DeletePlaylistModal;
