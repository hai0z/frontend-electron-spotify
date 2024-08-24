import React, { ElementRef, useEffect, useRef, useState } from "react";
import { getLyric, getSong } from "../services/MusicService";
import { saveToHistory } from "../services/firebase";
import { useAppSettingStore } from "../store/AppSettingStore";
import { useAuth } from "./AuthProvider";
import { useContextMenu } from "react-contexify";
import { useTrackPlayerStore } from "../store/TrackPlayerStore";
("use client");
export const MENU_ID = "TRACK_CONTEXT_MENU";
interface IAppContext {
  currentTime: number;
  duration: number;
  progress: React.RefObject<HTMLInputElement>;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  audioRef: React.RefObject<HTMLAudioElement>;
  displayMenu: (e: any) => void;
}
export const AppContext = React.createContext<IAppContext>({} as IAppContext);
const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentSong, setCurrentSong, setIsPlaying, setLyric } =
    useTrackPlayerStore();

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

  useEffect(() => {
    setIsPlaying(false);
    document.getElementsByTagName("html")[0]?.setAttribute("data-theme", theme);
  }, []);

  useEffect(() => {
    saveToHistory(currentSong);
  }, [currentSong?.encodeId]);

  useEffect(() => {
    setLyric([]);
    setCurrentTime(0);
    if (currentSong) {
      getAudioUrl().then((audioUrl) => {
        if (audioRef?.current) {
          audioRef.current.src = "";
          audioRef.current.load();
        }

        setCurrentSong({ ...currentSong, url: audioUrl.data["128"] });
      });

      getLyric(currentSong?.encodeId).then((lyric) => {
        setLyric(lyric);
      });
    }
  }, [currentSong?.encodeId]);

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
      }}
    >
      {isLogin && isLoaded && children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => React.useContext(AppContext);

export default AppProvider;
