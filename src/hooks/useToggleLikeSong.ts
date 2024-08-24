import { useEffect, useState } from "react";
import { addToLikedList } from "../services/firebase";
import toast from "react-hot-toast";
import { useUserStore } from "../store/UserStore";

const useToggleLikeSong = (trackId = null) => {
  const [isLiked, setIsLiked] = useState(false);

  const { likedSongs } = useUserStore((state) => state);

  useEffect(() => {
    if (likedSongs.length > 0) {
      setIsLiked(likedSongs.some((s: any) => s.encodeId === trackId));
    }
  }, [likedSongs.length, trackId]);

  const handleAddToLikedList = async (likedSong: any) => {
    setIsLiked(!isLiked);
    if (isLiked) {
      toast.error("Đã xoá khỏi yêu thích");
    } else {
      toast.success("Đã thêm vào yêu thích");
    }
    try {
      await addToLikedList(likedSong);
    } catch (err: any) {
      console.log(err);
    }
  };
  return {
    isLiked,
    handleAddToLikedList,
  };
};

export default useToggleLikeSong;
