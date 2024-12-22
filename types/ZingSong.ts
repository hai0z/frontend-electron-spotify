export interface ZingSong {
  encodeId: string;
  title: string;
  alias: string;
  isOffical: boolean;
  username: string;
  artistsNames: string;
  artists: Artist[];
  isWorldWide: boolean;
  thumbnailM: string;
  link: string;
  thumbnail: string;
  duration: number;
  zingChoice: boolean;
  isPrivate: boolean;
  preRelease: boolean;
  releaseDate: number;
  genreIds: string[];
  album: Album;
  distributor: string;
  indicators: any[];
  isIndie: boolean;
  streamingStatus: number;
  allowAudioAds: boolean;
  hasLyric: boolean;
}

export interface Album {
  encodeId: string;
  title: string;
  thumbnail: string;
  isoffical: boolean;
  link: string;
  isIndie: boolean;
  releaseDate: string;
  sortDescription: string;
  releasedAt: number;
  genreIds: string[];
  PR: boolean;
  artists: Artist2[];
  artistsNames: string;
}

interface Artist2 {
  id: string;
  name: string;
  link: string;
  spotlight: boolean;
  alias: string;
  thumbnail: string;
  thumbnailM: string;
  isOA: boolean;
  isOABrand: boolean;
  playlistId: string;
  totalFollow: number;
}

interface Artist {
  id: string;
  name: string;
  link: string;
  spotlight: boolean;
  alias: string;
  thumbnail: string;
  thumbnailM: string;
  isOA: boolean;
  isOABrand: boolean;
  playlistId: string;
}
