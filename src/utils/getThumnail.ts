const getThumbnail = (url: string | null, size: number = 720) => {
  if (!url) return url;
  const newUrl = url.replace(/w\d+/, `w${size}`);
  return newUrl;
};

export default getThumbnail;
