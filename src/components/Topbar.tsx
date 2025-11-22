// TopBar.tsx
import { FiArrowUpRight, FiBell, FiMenu } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import logo from "../assets/favicon.png"; // Your logo
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface TopBarProps {
  isMobile: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ isMobile, setSidebarOpen, searchQuery = "", onSearchChange }) => {
  return (
    <div className="flex justify-between items-center mb-6 gap-2">
      {/* Mobile Menu + Logo */}
      {isMobile ? (
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            onClick={() => setSidebarOpen(true)}
            className="text-2xl text-gray-700 hover:text-purple-600"
          >
            <FiMenu />
          </Button>
          <div className="flex items-center justify-center flex-1">
            <img
              src={logo}
              alt="Logo"
              className="w-20 h-20 object-contain mx-auto"
            />
          </div>
          <FiBell className="text-xl text-gray-500 cursor-pointer hover:text-purple-600" />
        </div>
      ) : (
        <>
          <div className="flex-1 flex justify-center">
            <div className="relative lg:w-[700px] sm:w-[500px]">
              <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-[20px]" />
              <input
                type="text"
                placeholder="Search here"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full bg-[#F5F0FF] border-none rounded-xl pl-12 pr-4 py-3 text-[14px] md:text-[16px] font-poppins focus:outline-none focus:ring-2 focus:ring-[#B749DB]/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FiBell className="text-lg text-gray-500 cursor-pointer hover:text-purple-600" />
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/50" alt="Admin" />
              <AvatarFallback>ADMIN</AvatarFallback>
            </Avatar>
          </div>
        </>
      )}
    </div>
  );
};

export default TopBar;
