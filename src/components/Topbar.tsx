// TopBar.tsx
import { FiArrowUpRight, FiBell, FiMenu } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import logo from "../assets/favicon.png"; // Your logo
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface TopBarProps {
  isMobile: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopBar: React.FC<TopBarProps> = ({ isMobile, setSidebarOpen }) => {
  return (
    <div className="flex justify-between items-center mb-6">
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
              <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B749DB] text-xl" />
              <input
                type="text"
                placeholder="Search here..."
                className="border px-12 py-2 w-full bg-[#B749DB]/10 rounded-full focus:ring-2 focus:ring-purple-400 placeholder:text-[#B749DB] text-center shadow-sm"
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
