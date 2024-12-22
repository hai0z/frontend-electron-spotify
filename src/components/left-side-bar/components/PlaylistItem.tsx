import { Link } from "react-router-dom";
import { useAppSettingStore } from "../../../store/AppSettingStore";
import RenderPlaylistThumbnail from "../../PlaylistThumbnail";

interface PlaylistItemProps {
  playlist: any;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ playlist }) => {
  const { isCollapseLibrary } = useAppSettingStore();

  const thumbnailSize = 50;

  return (
    <div className="group">
      <Link
        key={playlist.encodeId}
        to={`/myplaylist/${playlist.encodeId}`}
        className="flex flex-row items-center w-full px-2 py-2 transition-colors duration-200 ease-in-out rounded-lg cursor-pointer hover:bg-base-100"
        style={{
          justifyContent: isCollapseLibrary ? "center" : "flex-start",
        }}
      >
        <div
          className="flex"
          style={{
            flex: isCollapseLibrary ? 1 : "none",
          }}
        >
          {playlist?.songs?.length > 0 ? (
            <RenderPlaylistThumbnail
              height={thumbnailSize}
              width={thumbnailSize}
              playlistLength={playlist.songs.length}
              songs={playlist.songs}
            />
          ) : (
            <div
              className="overflow-hidden rounded-lg"
              style={{ height: thumbnailSize, width: thumbnailSize }}
            >
              <img
                src={playlist.thumbnail}
                alt={playlist.title}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          )}
        </div>
        {!isCollapseLibrary && (
          <div className="flex flex-col flex-1 ml-3">
            <p className="text-base font-medium text-base-content line-clamp-1 text-ellipsis group-hover:text-primary">
              {playlist.title}
            </p>
            <p className="text-sm text-base-content/70">
              {playlist.isAlbum
                ? "Album"
                : `Danh sách phát • ${playlist.songs?.length || 0} bài hát`}
            </p>
          </div>
        )}
      </Link>
    </div>
  );
};

export default PlaylistItem;
