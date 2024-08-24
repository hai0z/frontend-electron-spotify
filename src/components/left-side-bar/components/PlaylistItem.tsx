import { Link } from "react-router-dom";
import { useAppSettingStore } from "../../../store/AppSettingStore";
import RenderPlaylistThumbnail from "../../PlaylistThumbnail";

const PlaylistItem = ({ playlist }: any) => {
  const { isCollapseLibrary } = useAppSettingStore();

  return (
    <div>
      <Link
        key={playlist.encodeId}
        to={`/myplaylist/${playlist.encodeId}`}
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
          {playlist?.songs.length > 0 ? (
            <RenderPlaylistThumbnail
              height={50}
              width={50}
              playlistLength={playlist?.songs?.length}
              songs={playlist?.songs}
            />
          ) : (
            <div style={{ height: 50, width: 50 }}>
              <img
                src={playlist?.thumbnail}
                style={{ height: 50, width: 50 }}
              />
            </div>
          )}
        </div>
        {!isCollapseLibrary && (
          <div className="flex-1 flex ml-3 flex-col">
            <p className="text-base-content line-clamp-1 text-ellipsis">
              {playlist?.title}
            </p>
            <p className="text-base-content/70 text-sm">
              {playlist?.isAlbum
                ? "Album"
                : "Danh sách phát • " + playlist?.songs?.length + " bài hát"}
            </p>
          </div>
        )}
      </Link>
    </div>
  );
};

export default PlaylistItem;
