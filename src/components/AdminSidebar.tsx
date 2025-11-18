import { Button } from "./ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./ui/Tooltip";
import { useNavigate } from "react-router-dom";
import { TiThLargeOutline } from "react-icons/ti"; 
import { BiTrip } from "react-icons/bi";
import {
  FiSettings,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import {
  FaHotel,
  FaGift,
  FaMapMarkedAlt,
  FaCarSide,
  FaUsers,
  FaUser,
  FaTruck,
} from "react-icons/fa";
import logo from "../assets/favicon.png"; // Your logo
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, isMobile, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", icon: <TiThLargeOutline />, link: "/admin-dashboard" },
    { label: "User", icon: <FaUser/>, link: "/user" },
    { label: "Tour", icon: <FaMapMarkedAlt />, link: "/tour" },
    { label: "Hotel & Destination", icon: <FaHotel />, link: "/hotel" },
    { label: "Vehicle", icon: <FaCarSide />, link: "/vehicle" },
    { label: "Driver", icon: <FaTruck />, link: "/driver" },
    { label: "Staff", icon: <FaUsers />, link: "/staff" },
    { label: "Trip", icon: <BiTrip />, link: "/trip" },
    { label: "Reward", icon: <FaGift />, link: "/reward" },
  ];

  return (
    <aside
      className={`bg-white shadow-lg flex flex-col justify-between border-r border-[#B749DB] transition-all duration-300 fixed md:static z-50
          ${isMobile
          ? `top-0 left-0 h-full w-full ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
          : `${collapsed ? "w-20" : "w-64"}`}
    `}
    >
      <div className="flex flex-col justify-between h-full">
        {/* Sidebar Header (Hide on Mobile) */}
        {!isMobile && (
          <div className="flex items-center justify-center p-4 border-b border-gray-100">
            <img
              src={logo}
              alt="Logo"
              onClick={() => setCollapsed(!collapsed)}
              className="cursor-pointer w-16 h-16 object-contain"
            />
          </div>
        )}

        {/* Mobile Close Button */}
        {isMobile && (
          <div className="flex justify-end p-4">
            <FiX
              onClick={() => setSidebarOpen(false)}
              className="text-3xl text-gray-600 cursor-pointer hover:text-purple-600"
            />
          </div>
        )}

        {/* Sidebar Menu */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <TooltipProvider>
            <nav className="space-y-6 font-medium">
              {menuItems.map((item) => (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => navigate(item.link)} // Handle navigation
                      className={`w-full flex items-center gap-3 text-gray-700 hover:bg-purple-100 hover:text-purple-700 ${collapsed && !isMobile
                        ? "justify-center"
                        : "justify-start pl-4"}`}
                    >
                      <span className="text-[24px]">{item.icon}</span>
                      {(!collapsed || isMobile) && (
                        <span className="text-[20px]">{item.label}</span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  {collapsed && !isMobile && (
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  )}
                </Tooltip>
              ))}
            </nav>
          </TooltipProvider>
        </div>

        {/* Bottom Section (Visible in Mobile too) */}
        <div className="p-4
         border-t border-gray-100">
          <div className="space-y-7">
            {/* Settings Button with Tooltip */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`w-full flex text-[20px] items-center gap-3 text-gray-700 hover:bg-purple-50 justify-start pl-4 ${collapsed ? "justify-center" : "justify-start"}`}
                  >
                    <FiSettings className="text-[24px]" />
                    {!collapsed && <span>Settings</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Log Out Button with Tooltip */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/login")}
                    className={`w-full flex text-[20px] items-center gap-3 text-gray-700 border-gray-300 hover:bg-purple-50 justify-start pl-4 ${collapsed ? "justify-center" : "justify-start"}`}
                  >
                    <FiLogOut className="text-[24px]" />
                    {!collapsed && <span>Log Out</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Log Out</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Profile Section with Tooltip */}
            <div className="flex items-center gap-3 mt-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/50" alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>Jacqueline Fernando</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div>
                <p className={`font-semibold text-lg ${collapsed ? "hidden" : "block"}`}>Jacqueline Fernando</p>
                <p className={`text-sm text-gray-500 ${collapsed ? "hidden" : "block"}`}>jack@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
