import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppSettingState {
  queueVisible: boolean;
  setQueueVisible: (queueVisible: boolean) => void;
  isFullScreenMode: boolean;
  setIsFullScreenMode: (isFullScreenMode: boolean) => void;
  isShowLyric: boolean;
  setIsShowLyric: (isShowLyric: boolean) => void;
  isCollapseLibrary: boolean;
  setIsCollapseLibrary: (isCollapseLibrary: boolean) => void;
  isLoaded: boolean;
  setLoaded: (isLoaded: boolean) => void;
  recentTrackColor: string;
  setRecentTrackColor: (recentTrackColor: string) => void;
  nowPlayingVisible: boolean;
  setNowPlayingVisible: (nowPlayingVisible: boolean) => void;
  createPlaylistModalVisible: boolean;
  setCreatePlaylistModalVisible: (createPlaylistModalVisible: boolean) => void;
  selectedTrack: any;
  setSelectedTrack: (selectedTrack: any) => void;
  selectedPlaylist: any;
  setSelectedPlaylist: (selectedPlaylist: any) => void;
  theme: string;
  setTheme: (theme: string) => void;
}
export const useAppSettingStore = create<AppSettingState>()(
  persist(
    (set) => ({
      queueVisible: false,
      setQueueVisible: (queueVisible: boolean) => set({ queueVisible }),
      isFullScreenMode: false,
      setIsFullScreenMode: (isFullScreenMode: boolean) =>
        set({ isFullScreenMode }),
      isShowLyric: false,
      setIsShowLyric: (isShowLyric) => set({ isShowLyric }),
      isCollapseLibrary: false,
      setIsCollapseLibrary: (isCollapseLibrary) => set({ isCollapseLibrary }),
      isLoaded: false,
      setLoaded: (isLoaded) => set({ isLoaded }),
      recentTrackColor: "",
      setRecentTrackColor: (recentTrackColor) => set({ recentTrackColor }),
      nowPlayingVisible: false,
      setNowPlayingVisible: (nowPlayingVisible) => set({ nowPlayingVisible }),
      createPlaylistModalVisible: false,
      setCreatePlaylistModalVisible: (createPlaylistModalVisible) =>
        set({
          createPlaylistModalVisible,
        }),
      selectedTrack: null,
      setSelectedTrack: (selectedTrack) => set({ selectedTrack }),
      theme: "halloween",
      setTheme: (theme) => set({ theme }),
      selectedPlaylist: null,
      setSelectedPlaylist: (selectedPlaylist) => set({ selectedPlaylist }),
    }),
    {
      name: "app-setting",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setLoaded(true);
      },
    }
  )
);
