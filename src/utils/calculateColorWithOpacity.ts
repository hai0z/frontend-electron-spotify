function calculateColorWithOpacity(hexColor: string, opacity: number) {
  // Chuyển đổi mã màu hex thành các giá trị RGB
  const hexToRgb = (hex: any) => {
    return {
      r: parseInt(hex.substring(1, 3), 16),
      g: parseInt(hex.substring(3, 5), 16),
      b: parseInt(hex.substring(5, 7), 16),
    };
  };

  // Áp dụng opacity cho mỗi giá trị màu
  const applyOpacity = (color: any, opacity: number) => {
    return {
      r: Math.round(color.r * opacity),
      g: Math.round(color.g * opacity),
      b: Math.round(color.b * opacity),
    };
  };

  // Chuyển đổi RGB mới thành mã màu hex
  const rgbToHex = (color: any) => {
    const componentToHex = (c: any) => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return (
      "#" +
      componentToHex(color.r) +
      componentToHex(color.g) +
      componentToHex(color.b)
    );
  };

  // Lấy giá trị RGB từ mã màu hex
  const rgbColor = hexToRgb(hexColor);

  // Áp dụng opacity cho mỗi giá trị màu
  const newRgbColor = applyOpacity(rgbColor, opacity);

  // Chuyển đổi RGB mới thành mã màu hex
  const newHexColor = rgbToHex(newRgbColor);

  return newHexColor;
}

export default calculateColorWithOpacity;
