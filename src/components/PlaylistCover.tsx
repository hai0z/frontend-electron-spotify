import React, { useState } from "react";
import getThumbnail from "../utils/getThumnail";
import { useAppSettingStore } from "../store/AppSettingStore";
import { Link } from "react-router-dom";
import { BsFillPlayFill } from "react-icons/bs";

interface coverProps {
  title: string;
  sortDescription?: string;
  thumbnail: string;
  link: string;
}

const Cover: React.FC<coverProps> = ({
  title,
  sortDescription,
  thumbnail,
  link,
}) => {
  const [isCoverHover, setCoverHover] = useState(false);
  const { isCollapseLibrary, queueVisible, nowPlayingVisible } =
    useAppSettingStore();

  return (
    <div
      style={{
        width:
          (!isCollapseLibrary && queueVisible) || nowPlayingVisible ? 165 : 200,
      }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-xl">
        <Link to={link}>
          <img
            className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-110"
            src={getThumbnail(thumbnail) as string}
            alt={title}
            onMouseOver={() => setCoverHover(true)}
            onMouseOut={() => setCoverHover(false)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 w-full p-4">
              <h3 className="text-white font-bold truncate">{title}</h3>
              {sortDescription && (
                <p className="text-white/80 text-sm truncate">
                  {sortDescription}
                </p>
              )}
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-primary-focus">
              <BsFillPlayFill size={28} className="text-white ml-1" />
            </div>
          </div>
        </Link>
        <div
          className={`absolute top-3 w-full h-full z-[-1] bg-cover rounded-xl blur-xl scale-95 transition-all duration-500
            ${isCoverHover ? "opacity-70" : "opacity-0"}
          `}
          style={{
            backgroundImage: `url(${thumbnail})`,
          }}
        />
      </div>
      <div className="mt-4 px-1">
        <Link
          to={link}
          className="block text-base font-bold truncate hover:text-primary transition-colors duration-200"
        >
          {title}
        </Link>
        {sortDescription && (
          <p className="text-sm mt-1.5 text-base-content/70 font-medium line-clamp-2">
            {sortDescription}
          </p>
        )}
      </div>
    </div>
  );
};

export default Cover;
