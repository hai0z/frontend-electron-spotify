"use server";
var Vibrant = require("node-vibrant");

export const getVibrantColor = async (url: string) => {
  const palette = await Vibrant.from(url).getPalette();
  return palette.Vibrant?.hex;
};

export default getVibrantColor;
