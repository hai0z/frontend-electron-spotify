import { Heart } from "iconsax-react";
import useToggleLikeSong from "../hooks/useToggleLikeSong";
import { GREEN } from "../constants";
import { useTrackPlayerStore } from "../store/TrackPlayerStore";

const ToggleLikeButton = () => {
  const { currentSong } = useTrackPlayerStore();
  const { handleAddToLikedList, isLiked } = useToggleLikeSong(
    currentSong?.encodeId
  );
  return (
    currentSong && (
      <div
        className="cursor-pointer"
        onClick={() => handleAddToLikedList(currentSong)}
      >
        <Heart
          size="32"
          color={isLiked ? GREEN : "oklch(var(--bc))"}
          variant={isLiked ? "Bold" : "Outline"}
        />
      </div>
    )
  );
};

export default ToggleLikeButton;
