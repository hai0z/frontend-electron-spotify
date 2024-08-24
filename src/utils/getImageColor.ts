import { FastAverageColor } from "fast-average-color";

export const getImageColor = async (url: string) => {
  const fac = new FastAverageColor();
  return fac
    .getColorAsync(url, {
      algorithm: "dominant",
      height: 1,
    })
    .then((color) => {
      return color.hex;
    })
    .catch((e) => {
      console.log(e);
    });
};
