import React, { ElementRef, useEffect, useRef, useState } from "react";
import { getLyric, getSong } from "../services/MusicService";
import { saveToHistory } from "../services/firebase";
import { useAppSettingStore } from "../store/AppSettingStore";
import { useAuth } from "./AuthProvider";
import { useContextMenu } from "react-contexify";
import { useTrackPlayerStore } from "../store/TrackPlayerStore";
import axios from "axios";
import { convertYoutubeToZingSongRelated } from "../page/youtube/Home";
export const MENU_ID = "TRACK_CONTEXT_MENU";
interface IAppContext {
  currentTime: number;
  duration: number;
  progress: React.RefObject<HTMLInputElement>;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  audioRef: React.RefObject<HTMLAudioElement>;
  displayMenu: (e: any) => void;
  youtubeUrlLoading: boolean;
}
const getYoutubeAudioUrl = async (songId: string) => {
  const audioUrl = await axios.get(
    `http://localhost:5151/api/youtube/get-audio?videoId=${songId}`
  );
  return audioUrl.data;
};
const getRelatedYoutubeSong = async (songId: string) => {
  const relatedSong = await axios.get(
    `http://localhost:5151/api/youtube/related?videoId=${songId}`
  );
  return relatedSong.data;
};
export const AppContext = React.createContext<IAppContext>({} as IAppContext);
const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    currentSong,
    setCurrentSong,
    setIsPlaying,
    setLyric,
    setQueue,
    playlist,
    setPlaylist,
  } = useTrackPlayerStore();

  const { isLoaded, theme } = useAppSettingStore();

  const getAudioUrl = async () => {
    const audioUrl = await getSong(currentSong?.encodeId);
    return audioUrl;
  };

  // 🔥 you can use this hook from everywhere. All you need is the menu id
  const { show } = useContextMenu({
    id: MENU_ID,
  });

  function displayMenu(e: any) {
    // put whatever custom logic you need
    // you can even decide to not display the Menu
    show({
      event: e,
    });
  }
  const { isLogin } = useAuth();

  const [currentTime, setCurrentTime] = useState(0);

  const progress = useRef<ElementRef<"input">>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  const [duration, setDuration] = useState(0);

  const [youtubeUrlLoading, setYoutubeUrlLoading] = useState(false);
  useEffect(() => {
    setIsPlaying(false);
    document.getElementsByTagName("html")[0]?.setAttribute("data-theme", theme);
  }, []);

  useEffect(() => {
    if (currentSong?.type !== "youtubeSong") {
      saveToHistory(currentSong);
    }
  }, [currentSong?.encodeId]);

  useEffect(() => {
    setLyric([]);
    setCurrentTime(0);
    if (currentSong?.type !== "youtubeSong") {
      if (audioRef?.current) {
        audioRef.current.src = "";
        audioRef.current.load();
      }
      setYoutubeUrlLoading(false);
      getAudioUrl().then((audioUrl) => {
        setCurrentSong({ ...currentSong, url: audioUrl.data["128"] });
      });

      getLyric(currentSong?.encodeId).then((lyric) => {
        setLyric(lyric);
      });
    } else {
      setYoutubeUrlLoading(true);
      if (audioRef?.current) {
        audioRef.current.src = "";
        audioRef.current.load();
      }

      getYoutubeAudioUrl(currentSong?.encodeId).then((audioUrl) => {
        setCurrentSong({ ...currentSong, url: audioUrl });
        setYoutubeUrlLoading(false);
      });
    }
  }, [currentSong?.encodeId]);

  useEffect(() => {
    if (currentSong?.type === "youtubeSong") {
      getRelatedYoutubeSong(currentSong?.encodeId).then((relatedSong) => {
        setQueue([
          currentSong,
          ...relatedSong.contents[0].contents.map((song: any) =>
            convertYoutubeToZingSongRelated(song)
          ),
        ]);
        setPlaylist({
          ...playlist,
          songs: [
            currentSong,
            ...relatedSong.contents[0].contents.map((song: any) =>
              convertYoutubeToZingSongRelated(song)
            ),
          ],
        });
      });
    }
  }, [playlist?.encodeId]);
  return (
    <AppContext.Provider
      value={{
        currentTime,
        duration,
        progress,
        setCurrentTime,
        setDuration,
        audioRef,
        displayMenu,
        youtubeUrlLoading,
      }}
    >
      {isLogin && isLoaded && children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => React.useContext(AppContext);

export default AppProvider;
