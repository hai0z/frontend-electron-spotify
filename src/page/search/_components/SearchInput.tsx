"use client";
import { useDebounce } from "../../../hooks/useDebounce";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CiCircleRemove, CiSearch } from "react-icons/ci";
import { useNavigate, useSearchParams } from "react-router-dom";

const SearchInput = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");
  const debouceSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    navigate(`/search/?q=${debouceSearch}`);
  }, [debouceSearch]);

  return (
    <div className="w-full pr-4">
      <label className="input flex items-center gap-2 w-full max-w-md">
        <CiSearch size={24} />
        <input
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
          type="text"
          className="grow"
          placeholder="Nhập tên bài hát, nghệ sĩ..."
        />
        {searchValue && (
          <motion.div whileHover={{ scale: 1.1 }}>
            <CiCircleRemove
              size={24}
              onClick={() => setSearchValue("")}
              className="cursor-pointer"
            />
          </motion.div>
        )}
      </label>
    </div>
  );
};

export default SearchInput;
