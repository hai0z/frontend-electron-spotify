"use client";
import React, { useState } from "react";
import getThumbnail from "../utils/getThumnail";
import { useAppSettingStore } from "../store/AppSettingStore";
import { Link } from "react-router-dom";

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
    >
      <div className="relative">
        <Link to={link}>
          <img
            className="rounded-xl w-[100%] cursor-pointer"
            src={getThumbnail(thumbnail) as string}
            alt={title}
            onMouseOver={() => {
              setCoverHover(true);
            }}
            onMouseOut={() => {
              setCoverHover(false);
            }}
          />
        </Link>
        <div
          className={`absolute top-3 w-full h-full z-[-1] bg-cover rounded-xl blur-lg scale-95 transition-opacity duration-300
            ${isCoverHover === false ? "opacity-0" : "opacity-100"}
          `}
          style={{
            backgroundImage: `url(${thumbnail})`,
          }}
        ></div>
        {/* End Image Blur */}
      </div>
      <div className="mt-2">
        {/* Title */}
        <div className="text-base font-semibold truncate hover:underline">
          <Link to={link}>{title}</Link>
        </div>
        {/* End Title */}

        {/* Sort Description */}
        <div
          className="text-xs  opacity-60"
          style={{
            maxWidth: "100%",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span>{sortDescription}</span>
        </div>
      </div>
    </div>
  );
};

export default Cover;
