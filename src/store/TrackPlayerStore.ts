import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ILyric {
  startTime: number;
  endTime: number;
  data: string;
}
interface TrackPlayerState {
  isPlaying: boolean;
  currentSong: any;
  setIsPlaying: (isPlaying: boolean) => void;
  queue: any[];
  setQueue: (queue: any[]) => void;
  setCurrentSong: (currentSong: any) => void;
  setIsLoop: (isLoop: boolean) => void;
  isLoop: boolean;
  volume: number;
  setVolume: (volume: number) => void;
  setIsShuffle: (isShuffle: boolean) => void;
  isShuffle: boolean;
  playlist: {
    encodeId: string;
    songs: any[];
    title: string;
    link?: string;
  };
  setPlaylist: (playlist: {
    encodeId: string;
    songs: any[];
    title: string;
    link?: string;
  }) => void;
  tempPlaylist: {
    encodeId: string;
    songs: any[];
    title: string;
  };
  setTempPlaylist: (tempPlaylist: {
    encodeId: string;
    songs: any[];
    title: string;
  }) => void;
  duration: number;
  setDuration: (duration: number) => void;
  currentTime: number;
  setCurrentTime: (currentTime: number) => void;
  lyric: ILyric[];
  setLyric: (lyric: ILyric[]) => void;
}
export const useTrackPlayerStore = create<TrackPlayerState>()(
  persist(
    (set) => ({
      isPlaying: false,
      currentSong: null,
      setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
      queue: [],
      setQueue: (queue: any[]) => set({ queue }),
      setCurrentSong: (currentSong: any) => set({ currentSong }),
      setIsLoop: (isLoop: boolean) => set({ isLoop }),
      isLoop: false,
      setIsShuffle: (isShuffle: boolean) => set({ isShuffle }),
      isShuffle: false,
      playlist: {
        encodeId: "",
        title: "",
        songs: [],
      },
      setPlaylist: (playlist) => set({ playlist }),
      tempPlaylist: {
        encodeId: "",
        title: "",
        songs: [],
      },
      setTempPlaylist: (tempPlaylist) => set({ tempPlaylist }),
      duration: 0,
      setDuration: (duration: number) => set({ duration }),
      currentTime: 0,
      setCurrentTime: (currentTime: number) => set({ currentTime }),
      lyric: [] as ILyric[],
      setLyric: (lyric) => set({ lyric }),
      volume: 0.5,
      setVolume: (volume) => set({ volume }),
    }),
    {
      name: "track-player",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
