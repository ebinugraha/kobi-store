import { SearchIcon } from "lucide-react";

export const SearchInput = () => {
  return (
    <div className="flex w-full max-w-[600px]">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search products"
          className="w-full pl-4 border border-gray-300 rounded-l-md h-10 focus:outline-none focus:border-primary text-sm"
        />
      </div>
      <button className="bg-primary text-white px-4 rounded-r-md h-10 flex items-center justify-center hover:bg-primary-dark cursor-pointer">
        <SearchIcon size={18} />
      </button>
    </div>
  );
};
