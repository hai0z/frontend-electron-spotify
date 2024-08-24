import { useEffect, useState } from "react";
import { useTrackPlayerStore } from "../store/TrackPlayerStore";
import useTrackPlayer from "./useTrackPlayer";

export default function useLyricIndex() {
  const [currentLine, setCurrentLine] = useState<number>(0);

  const lyrics = useTrackPlayerStore((state) => state.lyric);

  const { currentTime } = useTrackPlayer();

  useEffect(() => {
    if (lyrics) {
      let low = 0;
      let high = lyrics.length - 1;
      let result = -1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const midTime = +lyrics[mid].startTime;
        if (midTime <= Number(currentTime * 1000)) {
          result = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      if (currentLine !== result) {
        setCurrentLine(result);
      }
    }
  }, [currentTime]);

  return currentLine;
}
