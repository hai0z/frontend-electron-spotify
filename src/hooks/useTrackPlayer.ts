import { AppContext } from "../context/AppProvider";
import { useTrackPlayerStore } from "../store/TrackPlayerStore";
import { useContext } from "react";

export default function useTrackPlayer() {
  const {
    queue,
    playlist: currentPlaylist,
    setQueue,
    setIsPlaying,
    setCurrentSong,
    currentSong,
    isPlaying,
    setPlaylist,
    setCurrentTime,
    isShuffle,
    isLoop,
    setIsLoop,
    setIsShuffle,
    setTempPlaylist,
    currentTime,
  } = useTrackPlayerStore();

  const { audioRef } = useContext(AppContext);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioRef?.current?.pause();
    } else {
      setIsPlaying(true);
      audioRef?.current?.play();
    }
  };
  const handleNextSong = () => {
    const currentIndexSong = queue.findIndex(
      (i) => i?.encodeId == currentSong?.encodeId
    );

    if (currentIndexSong == -1) {
      setCurrentSong(queue[0]);
    } else {
      if (currentIndexSong < queue.length - 1) {
        setCurrentSong(queue[currentIndexSong + 1]);
      } else {
        setCurrentSong(queue[0]);
      }
    }
    setIsPlaying(true);
  };
  const handlePrevSong = () => {
    const currentIndexSong = queue.findIndex(
      (i) => i?.encodeId == currentSong?.encodeId
    );

    if (currentIndexSong == -1) {
      setCurrentSong(queue[0]);
    } else {
      if (currentIndexSong >= 1) {
        setCurrentSong(queue[currentIndexSong - 1]);
      } else {
        setCurrentSong(queue[queue.length - 1]);
      }
    }
    setIsPlaying(true);
  };
  const toggleLoop = () => setIsLoop(!isLoop);

  const toggleShuffle = () => {
    if (isShuffle) {
      setIsShuffle(false);
      // setQueue([]);
    } else {
      setIsShuffle(true);
      // setQueue(tempPlaylist.songs.sort(() => Math.random() - 0.5));
    }
  };
  const handlePlaySong = (
    song: any,
    playlist: { encodeId: string; songs: any[]; title: string; link?: string }
  ) => {
    setPlaylist(playlist);
    setTempPlaylist(playlist);
    if (
      playlist.encodeId !== currentPlaylist?.encodeId ||
      playlist.encodeId === ""
    ) {
      setQueue(playlist.songs);
      setIsShuffle(false);
    }
    if (song.encodeId !== currentSong?.encodeId) {
      setIsPlaying(true);
      setCurrentSong(song);
    } else {
      setIsPlaying(!isPlaying);
    }
  };
  const seekTo = (time: number) => {
    setCurrentTime(time);
    if (audioRef?.current) {
      audioRef.current.currentTime = time;
    }
  };

  return {
    handlePlaySong,
    seekTo,
    handleNextSong,
    handlePrevSong,
    toggleLoop,
    toggleShuffle,
    handlePlayPause,
    currentTime,
  };
}
