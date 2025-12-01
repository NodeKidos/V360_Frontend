import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/Tooltip';
import { useNavigate } from 'react-router-dom';
import { TiThLargeOutline } from 'react-icons/ti';
import { FaUser, FaMapMarkedAlt, FaHotel, FaCarSide, FaTruck, FaUsers, FaGift } from 'react-icons/fa';
import { BiTrip } from 'react-icons/bi';
import logo from '../assets/favicon.png'; // Your logo
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { IoMdSettings } from 'react-icons/io';

// Define the menu configuration for each role
const sidebarMenuConfig = {
  admin: [
    { label: 'Dashboard', icon: <TiThLargeOutline />, link: '/admin-dashboard' },
    { label: 'User', icon: <FaUser />, link: '/user' },
    { label: 'Tour', icon: <FaMapMarkedAlt />, link: '/tour' },
    { label: 'Hotel & Destination', icon: <FaHotel />, link: '/destination-hotel' },
    { label: 'Vehicle', icon: <FaCarSide />, link: '/vehicle' },
    { label: 'Driver', icon: <FaTruck />, link: '/driver' },
    { label: 'Staff', icon: <FaUsers />, link: '/staff' },
    { label: 'Trip', icon: <BiTrip />, link: '/trip' },
    { label: 'Reward', icon: <FaGift />, link: '/reward' },
    { label: 'Settings', icon: <IoMdSettings />, link: '/setting' }
  ],
  staff: [
    { label: 'Dashboard', icon: <TiThLargeOutline />, link: '/staff-dashboard' },
    { label: 'Trip', icon: <BiTrip />, link: '/trip' },
    { label: 'Driver', icon: <FaTruck />, link: '/driver' }
  ],
  driver: [
    { label: 'My Trips', icon: <BiTrip />, link: '/driver-trips' },
    { label: 'Profile', icon: <FaUser />, link: '/driver-profile' }
  ],
  user: [
    { label: 'Dashboard', icon: <TiThLargeOutline />, link: '/user-dashboard' },
    { label: 'Itineary', icon: <FaGift />, link: '/itinerary-summary' },
    { label: 'My Plans', icon: <BiTrip />, link: '/user-plans' },
    { label: 'Rewards', icon: <FaGift />, link: '/reward' }
  ]
};

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  isMobile,
  sidebarOpen,
  setSidebarOpen
}) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<keyof typeof sidebarMenuConfig>('user'); // Default to 'user'

  useEffect(() => {
    // Fetch the role from localStorage
    const storedRole = localStorage.getItem('userRole') as keyof typeof sidebarMenuConfig | null;

    // Validate if the stored role is valid and exists in sidebarMenuConfig
    if (storedRole && sidebarMenuConfig[storedRole]) {
      setRole(storedRole); // Set role if valid
    } else {
      setRole('user'); // Default role if invalid or not found
    }
  }, []);


  const menuItems = sidebarMenuConfig[role] || [];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`bg-white shadow-lg flex flex-col justify-between border-r border-[#B749DB] transition-all duration-300 h-screen
          ${isMobile
            ? `fixed top-0 left-0 w-[280px] z-50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
            : `static ${collapsed ? "w-20" : "w-64"}`}
        `}
      >
        <div className="flex flex-col justify-between h-full py-4">
          {/* Desktop Logo */}
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

          {/* Mobile Close */}
          {isMobile && (
            <div className="flex justify-end p-4">
              <FaUser
                onClick={() => setSidebarOpen(false)}
                className="text-3xl text-gray-600 cursor-pointer hover:text-purple-600"
              />
            </div>
          )}

          {/* MENU */}
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <TooltipProvider>
              <nav className="space-y-4">
                {menuItems.map((item) => (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => navigate(item.link)}
                        className={`w-full flex items-center gap-3 text-gray-700 hover:bg-purple-100 hover:text-purple-700
                          ${collapsed && !isMobile ? "justify-center" : "justify-start pl-4"}`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        {(!collapsed || isMobile) && (
                          <span className="text-base font-roboto font-medium">{item.label}</span>
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

          {/* FOOTER */}
          <div className="px-4 space-y-4">
            {/* Logout */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/login")}
                    className={`w-full flex items-center gap-3 text-gray-700 border-gray-300 hover:bg-purple-50
                      ${collapsed && !isMobile ? "justify-center" : "justify-start pl-4"}`}
                  >
                    <FaUser className="text-lg" />
                    {(!collapsed || isMobile) && <span>Log Out</span>}
                  </Button>
                </TooltipTrigger>
                {collapsed && !isMobile && <TooltipContent>Log Out</TooltipContent>}
              </Tooltip>
            </TooltipProvider>

            {/* Avatar */}
            <div
              className={`flex ${collapsed && !isMobile ? "justify-center" : "items-center gap-3"}`}
            >
              <Avatar>
                <AvatarImage src="https://i.pravatar.cc/50" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>

              {(!collapsed || isMobile) && (
                <div>
                  <p className="text-sm font-roboto font-medium">Jacqueline Fernando</p>
                  <p className="text-xs font-roboto text-gray-500">jack@gmail.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
