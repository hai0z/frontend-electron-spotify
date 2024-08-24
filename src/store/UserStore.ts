import { create } from "zustand";

type UserState = {
  myPlaylists: any[];
  setMyPlaylists: (data: any[]) => void;
  likedSongs: any[];
  setLikedSongs: (data: any[]) => void;
  listFollowArtists: any[];
  setListFollowArtists: (data: any[]) => void;
  likedPlaylists: any[];
  setLikedPlaylists: (data: any[]) => void;
  searchHistory: any[];
  setSearchHistory: (data: any[]) => void;
  recentList: any[];
  setRecentList: (data: any[]) => void;
};

export const useUserStore = create<UserState>((set) => ({
  myPlaylists: [],
  setMyPlaylists: (data: any[]) => set({ myPlaylists: data }),
  likedSongs: [],
  setLikedSongs: (data: any[]) => set({ likedSongs: data }),
  listFollowArtists: [],
  setListFollowArtists: (data: any[]) => set({ listFollowArtists: data }),
  likedPlaylists: [],
  setLikedPlaylists: (data: any[]) => set({ likedPlaylists: data }),
  searchHistory: [],
  setSearchHistory: (data: any[]) => set({ searchHistory: data }),
  recentList: [],
  setRecentList: (data: any[]) => set({ recentList: data }),
}));
