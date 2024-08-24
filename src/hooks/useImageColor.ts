import tinycolor from "tinycolor2";
export default function useImageColor(color: string, amount: number = 45) {
  let c1 = tinycolor(color);
  let rs1;
  if (c1.isLight()) {
    rs1 = tinycolor(c1).darken(amount).toString();
  } else {
    rs1 = tinycolor(c1).lighten(10).toString();
  }
  if (tinycolor(rs1).isLight()) {
    return tinycolor(rs1).darken(25).toString();
  } else {
    return tinycolor(rs1).lighten(10).toString();
  }
}
