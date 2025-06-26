import React from "react";
import { BiSearch } from "react-icons/bi";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search notes...",
}) => (
  <div className="flex justify-center w-full">
    <div className="relative text-gray-600 w-full sm:w-96">
      <input
        type="search"
        name="search"
        placeholder={placeholder}
        className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-full shadow border"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-0 m-0 bg-transparent border-none"
        style={{ lineHeight: 0 }}
      >
        <BiSearch className="text-gray-500" size={20} />
      </button>
    </div>
  </div>
);

export default SearchBar;