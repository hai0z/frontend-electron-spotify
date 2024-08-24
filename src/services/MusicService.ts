// import { zing } from "zingmp3-api-next";
import { ZingMp3 } from "./index";
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5151/api/",
});

async function getSong(songId: string) {
  const data = await instance.get(`song/?id=${songId}`);
  return data.data;
}

async function getDetailPlaylist(playlistId: string) {
  const data = await instance.get(`detailplaylist/?id=${playlistId}`);
  return data.data;
}

async function getHome() {
  const data = await instance.get("home");
  return data.data;
}

async function getTop100() {
  const data = await ZingMp3.getTop100();
  return data;
}

async function getChartHome() {
  const data = await instance.get("charthome");
  return data.data.data;
}

function getNewReleaseChart() {
  ZingMp3.getNewReleaseChart().then((data) => {
    return data;
  });
}

async function getInfo(songId: string) {
  const data = await instance.get(`infosong/?id=${songId}`);
  return data;
}

async function getArtist(name: string) {
  const data = await instance.get(`artist/?name=${name}`);
  return data;
}

async function getArtistSong(songId: string, page: number, count: number) {
  const data = await instance.get(
    `artistsong/?id=${songId}&page=${page}&count=${count}`
  );
  return data.data;
}

async function getLyric(songId: string) {
  const dataLyric = await (await instance.get(`lyric/?id=${songId}`)).data.data;
  console.log(dataLyric, "đầ");
  let customLyr: { startTime: number; endTime: number; data: string }[] = [];

  dataLyric.sentences &&
    dataLyric.sentences.forEach((e: { words: [] }, _: number) => {
      let lineLyric: string = "";
      let sTime: number = 0;
      let eTime: number = 0;

      e.words.forEach(
        (
          element: { data: string; startTime: number; endTime: number },
          index: number
        ) => {
          if (index === 0) {
            sTime = element.startTime;
          }
          if (index === e.words.length - 1) {
            eTime = element.endTime;
          }
          lineLyric = lineLyric + element.data + " ";
        }
      );
      customLyr.push({
        startTime: sTime,
        endTime: eTime,
        data: lineLyric,
      });
    });
  return customLyr;
}

async function search(keyword: string) {
  const data = await instance.get(`search/?keyword=${keyword}`);
  return data.data;
}

async function getSuggest(keyword: string) {
  // const data = await zing.get_suggestion_keyword(keyword);
  // return data;
}
async function getSongBackground(songId: string) {
  const data = await ZingMp3.getLyric(songId);
  return data.data.defaultIBGUrls;
}

const getHub = async () => {
  const item = await instance.get("hub");
  return item;
};

const getRecommendSong = async (id: string) => {
  const item = await instance.get(`recommend?id=${id}`);
  return item;
};

export {
  getSong,
  getDetailPlaylist,
  getHome,
  getTop100,
  getChartHome,
  getNewReleaseChart,
  getInfo,
  getArtistSong,
  getLyric,
  search,
  getSuggest,
  getArtist,
  getSongBackground,
  getHub,
  getRecommendSong,
};
