import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { YoutubeSearchResponse } from "../../../types/ytSearchResponse";
import { Album } from "../../../types/ZingSong";
import { Result } from "../../../types/ytSearchResponse";
import useTrackPlayer from "../../hooks/useTrackPlayer";
import { useTrackPlayerStore } from "../../store/TrackPlayerStore";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";

export function convertYoutubeToZingSongRelated(content: any) {
  return {
    type: "youtubeSong",
    encodeId: content.id || "",
    title: content.title || "",
    alias: "",
    isOffical: true,
    username: content.authors?.[0]?.name || "",
    artistsNames:
      content.authors?.map((author: any) => author.name).join(", ") || "",
    artists: [],
    isWorldWide: true,
    thumbnailM: content.thumbnail?.contents?.[0]?.url.replace(
      "w120-h120",
      "w720-h720"
    ),
    thumbnail: content.thumbnail?.contents?.[0]?.url.replace(
      "w120-h120",
      "w720-h720"
    ),
    duration: content.duration?.seconds || 0,
    zingChoice: false,
    isPrivate: false,
    preRelease: false,
    releaseDate: 0,
    genreIds: [],
    album: {} as Album,
    distributor: "",
    indicators: [],
    isIndie: false,
    streamingStatus: 1,
    allowAudioAds: true,
    hasLyric: false,
  };
}

export function convertYoutubeToZingSong(content: Result) {
  return {
    type: "youtubeSong",
    encodeId: content.id || "",
    title: content.title.text || "",
    alias: "",
    isOffical: true,
    username: content.author?.name || "",
    artistsNames: content.author?.name || "",
    artists: [],
    isWorldWide: true,
    thumbnailM: content.thumbnails?.[0]?.url,
    thumbnail: content.thumbnails?.[0]?.url,
    duration: content.duration?.seconds || 0,
    zingChoice: false,
    isPrivate: false,
    preRelease: false,
    releaseDate: 0,
    genreIds: [],
    album: {} as Album,
    distributor: "",
    indicators: [],
    isIndie: false,
    streamingStatus: 1,
    allowAudioAds: true,
    hasLyric: false,
  };
}

const YoutubeHome = () => {
  const { handlePlaySong } = useTrackPlayer();
  const { currentSong, isPlaying } = useTrackPlayerStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<YoutubeSearchResponse>(
    {} as YoutubeSearchResponse
  );
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [isSearched, setIsSearched] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsSearched(false);
      if (searchQuery.trim()) {
        try {
          const response = await axios.get(
            `http://localhost:5151/api/youtube/search-suggest?q=${searchQuery}`
          );
          if (response.data && response.data.length > 0) {
            setSuggestions(response.data);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setShowSuggestions(false);

    try {
      const response = await axios.get(
        `http://localhost:5151/api/youtube/search?q=${searchQuery}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching YouTube:", error);
    } finally {
      setLoading(false);
      setIsSearched(true);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  return (
    <div className="w-full bg-base-200 overflow-y-scroll pb-20 mx-2">
      <div className="container mx-auto  max-w-7xl">
        <div className="flex flex-col items-center mb-16 sticky top-0 z-30 bg-base-200 backdrop-blur-xl py-6">
          <div className="flex items-center gap-4 mb-8">
            <h1 className="text-4xl font-bold text-primary">YouTube Music</h1>
          </div>

          <div className="w-full max-w-4xl relative px-4">
            <div className="relative flex items-center">
              <input
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(searchQuery);
                  }
                }}
                type="search"
                placeholder="Tìm kiếm bài hát..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() =>
                  suggestions.length > 0 && setShowSuggestions(true)
                }
                className="input input-bordered w-full pl-12 pr-12 h-14 text-lg bg-base-100/40 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 rounded-full shadow-xl hover:shadow-2xl"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 absolute left-4 text-base-content/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <button
                className="btn btn-secondary h-14 px-8 ml-4 text-lg font-medium transition-all duration-300 rounded-full shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 disabled:opacity-70"
                onClick={() => handleSearch(searchQuery)}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  "Tìm kiếm"
                )}
              </button>
            </div>

            {showSuggestions &&
              suggestions.length > 0 &&
              !isSearched &&
              suggestions[0].contents && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-10 w-full mt-2 bg-base-100/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-base-300 transition-all duration-300 animate-slideDown"
                >
                  {suggestions[0].contents.map(
                    (suggestion: any, index: number) => (
                      <div
                        key={index}
                        className="px-6 py-3 hover:bg-primary/10 cursor-pointer first:rounded-t-2xl last:rounded-b-2xl flex items-center gap-4 transition-colors duration-200"
                        onClick={() =>
                          handleSuggestionClick(suggestion.suggestion.text)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-primary/70"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <p className="text-base-content/70 text-lg hover:text-primary transition-colors duration-200">
                          {suggestion.suggestion.text}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
          </div>
        </div>

        {searchResults.results && searchResults.results.length > 0 ? (
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-2 px-4">
            {searchResults.results
              .filter((result) => result.type === "Video")
              .map((result) => {
                return (
                  <div
                    key={result.id}
                    className="group  backdrop-blur-sm rounded-2xl  transition-all duration-300 overflow-hidden  border border-base-300/50 "
                  >
                    <div className="flex items-center px-4  gap-4">
                      <div className="relative aspect-square w-48 overflow-hidden">
                        <img
                          src={result.thumbnails?.[0]?.url}
                          alt={result.title.text}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => {
                              handlePlaySong(convertYoutubeToZingSong(result), {
                                encodeId: result.id!,
                                title: result.title.text,
                                songs: [convertYoutubeToZingSong(result)],
                              });
                            }}
                            className="w-14 h-14 rounded-full bg-primary flex items-center justify-center transform hover:scale-110 transition-transform shadow-lg"
                          >
                            {isPlaying &&
                            currentSong?.encodeId === result.id ? (
                              <BsFillPauseFill className="text-2xl text-primary-content" />
                            ) : (
                              <BsFillPlayFill className="text-2xl text-primary-content" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 ${
                            currentSong?.encodeId === result.id
                              ? "text-primary"
                              : ""
                          }`}
                        >
                          {result.title.text}
                        </h3>
                        <p className="text-base-content/60 truncate mb-3 hover:text-primary/80 transition-colors">
                          {result.author?.name}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-1.5 text-xs text-base-content/50 bg-base-content/5 px-3 py-1.5 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            <span>{result.view_count?.text}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-base-content/50 bg-base-content/5 px-3 py-1.5 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {result?.published && (
                              <span>{result.published.text}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-base-content/50 bg-base-content/5 px-3 py-1.5 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{result.duration?.text}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center  bg-base-200 backdrop-blur-md justify-center items-center flex flex-col mx-6 ">
            <div className="w-32 h-32 rounded-full bg-base-300 flex items-center justify-center mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-primary/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Bắt đầu tìm kiếm
            </h2>
            <p className="text-base-content/70 text-xl ">
              Khám phá hàng triệu bài hát, album và nghệ sĩ
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeHome;
