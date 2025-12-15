// TopBar.tsx
import { useState, useEffect } from "react";
import { FiBell, FiMenu } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import logo from "../assets/favicon.png";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import NotificationPopup from "./NotificationPopup";
import { useNotificationStore } from "../store/useNotificationStore";

interface TopBarProps {
  isMobile: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ isMobile, setSidebarOpen, searchQuery = "", onSearchChange }) => {
  const [userName, setUserName] = useState('User');
  const [userImage, setUserImage] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);

  const { unreadCount, fetchUnreadCount } = useNotificationStore();

  useEffect(() => {
    // Fetch user info from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'User';
        setUserName(fullName);
        setUserImage(user.profileImage || user.avatar || '');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Fetch unread count on mount
    fetchUnreadCount();

    // Set up interval to refresh count every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const handleBellClick = () => {
    // Refresh count when opening notifications
    fetchUnreadCount();
    setNotificationOpen(!notificationOpen);
  };

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

          {/* Notification Bell - Mobile */}
          <div className="relative cursor-pointer" onClick={handleBellClick}>
            <FiBell className="text-xl text-gray-500 hover:text-purple-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
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
            {/* Notification Bell - Desktop */}
            <div className="relative cursor-pointer" onClick={handleBellClick}>
              <FiBell className="text-lg text-gray-500 hover:text-purple-600 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>

            <Avatar>
              <AvatarImage src={userImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(userName)} alt={userName} />
              <AvatarFallback>{userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
        </>
      )}

      {/* Notification Popup */}
      <NotificationPopup isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />
    </div>
  );
};

export default TopBar;
