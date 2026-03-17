import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/Tooltip';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TiThLargeOutline } from 'react-icons/ti';
import { FaUser, FaHotel, FaCarSide, FaTruck, FaUsers, FaGift, FaRoute, FaClipboardList, FaMapMarkedAlt } from 'react-icons/fa';
import { BiTrip } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';
import { IoGameController, IoPricetagOutline } from 'react-icons/io5';
import logo from '../assets/favicon.png'; // Your logo
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { IoMdClose, IoMdSettings } from 'react-icons/io';
import { useAuthStore } from '../store/useAuthStore';

// Define the menu configuration for each role
const sidebarMenuConfig = {
  admin: [
    { label: 'dashboard.menu.dashboard', icon: <TiThLargeOutline />, link: '/admin-dashboard' },
    { label: 'dashboard.menu.itineraries', icon: <FaRoute />, link: '/itineraries' },
    { label: 'dashboard.menu.user', icon: <FaUser />, link: '/user' },
    { label: 'dashboard.menu.hotelDestination', icon: <FaHotel />, link: '/destination-hotel' },
    { label: 'dashboard.menu.vehicle', icon: <FaCarSide />, link: '/vehicle' },
    { label: 'dashboard.menu.driver', icon: <FaTruck />, link: '/driver' },
    { label: 'dashboard.menu.staff', icon: <FaUsers />, link: '/staff' },
    { label: 'dashboard.menu.activityLog', icon: <FaClipboardList />, link: '/activity-log' },
    { label: 'dashboard.menu.game', icon: <IoGameController />, link: '/v360/game' },
    { label: 'dashboard.menu.reward', icon: <FaGift />, link: '/reward' },
    { label: 'dashboard.menu.settings', icon: <IoMdSettings />, link: '/setting' }
  ],
  staff: [
    { label: 'dashboard.menu.dashboard', icon: <TiThLargeOutline />, link: '/staff-dashboard' },
    { label: 'dashboard.menu.itineraries', icon: <FaRoute />, link: '/itineraries' },
    // { label: 'dashboard.menu.trip', icon: <BiTrip />, link: '/trip' },
    { label: 'dashboard.menu.driver', icon: <FaTruck />, link: '/driver' },
    { label: 'dashboard.menu.settings', icon: <IoMdSettings />, link: '/setting' }
  ],
  driver: [
    { label: 'dashboard.menu.dashboard', icon: <TiThLargeOutline />, link: '/driver-dashboard' },
    { label: 'dashboard.menu.myTrips', icon: <BiTrip />, link: '/driver-trips' },
    { label: 'dashboard.menu.itineraries', icon: <FaMapMarkedAlt />, link: '/itinerary-details' },
    { label: 'dashboard.menu.profile', icon: <FaUser />, link: '/driver-profile' },
    { label: 'dashboard.menu.vehicle', icon: <FaCarSide />, link: '/driver-vehicle' },
    { label: 'dashboard.menu.game', icon: <IoGameController />, link: '/v360/game' },
  ],
  user: [
    { label: 'dashboard.menu.dashboard', icon: <TiThLargeOutline />, link: '/user-dashboard' },
    { label: 'dashboard.menu.myItineraries', icon: <FaRoute />, link: '/my-itineraries' },
    { label: 'dashboard.menu.createItinerary', icon: <BiTrip />, link: '/itinerary' },
    { label: 'dashboard.menu.packagePricing', icon: <IoPricetagOutline />, link: '/package-price' },
    { label: 'dashboard.menu.reward', icon: <FaGift />, link: '/reward' },
    { label: 'dashboard.menu.memories', icon: <FaGift />, link: '/memories' },
    { label: 'dashboard.menu.game', icon: <IoGameController />, link: '/play' },
    { label: 'dashboard.menu.profile', icon: <FaUser />, link: '/user-profile' }
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState<keyof typeof sidebarMenuConfig>('user'); // Default to 'user'
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('user@example.com');
  const [userImage, setUserImage] = useState('');

  useEffect(() => {
    // Fetch the role from localStorage
    const storedRole = localStorage.getItem('userRole') as keyof typeof sidebarMenuConfig | null;

    // Validate if the stored role is valid and exists in sidebarMenuConfig
    if (storedRole && sidebarMenuConfig[storedRole]) {
      setRole(storedRole); // Set role if valid
    } else {
      setRole('user'); // Default role if invalid or not found (customer)
    }

    // Fetch user info from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'User';
        setUserName(fullName);
        setUserEmail(user.email || 'user@example.com');
        setUserImage(user.profileImage || user.avatar || '');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);


  const menuItems = sidebarMenuConfig[role] || [];

  // Check if menu item is active
  const isActive = (link: string) => {
    return location.pathname === link || location.pathname.startsWith(link + '/');
  };

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
            ? `fixed top-0 left-0 w-[240px] z-50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
            : `static ${collapsed ? "w-16" : "w-52"}`}
        `}
      >
        <div className="flex flex-col justify-between h-full py-4">
          {/* Desktop Logo */}
          {!isMobile && (
            <div className="flex items-center justify-center p-3 border-b border-gray-100">
              <img
                src={logo}
                alt="Logo"
                onClick={() => setCollapsed(!collapsed)}
                className={`cursor-pointer object-contain transition-all ${collapsed ? "w-10 h-10" : "w-12 h-12"}`}
              />
            </div>
          )}

          {/* Mobile Close */}
          {isMobile && (
            <div className="flex justify-end p-4">
              <IoMdClose
                onClick={() => setSidebarOpen(false)}
                className="text-3xl text-gray-600 cursor-pointer hover:text-purple-600"
              />
            </div>
          )}

          {/* MENU */}
          <div className="flex-1 overflow-y-auto px-2 pb-6">
            <TooltipProvider>
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const active = isActive(item.link);
                  const translatedLabel = t(item.label);
                  return (
                    <Tooltip key={item.label}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          onClick={() => navigate(item.link)}
                          className={`w-full flex items-center gap-2 py-2 transition-all
                          ${collapsed && !isMobile ? "justify-center px-2" : "justify-start pl-3"}
                          ${active
                              ? "bg-purple-100 text-purple-700 border-l-4 border-purple-600 font-semibold"
                              : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                            }`}
                        >
                          <span className="text-base">{item.icon}</span>
                          {(!collapsed || isMobile) && (
                            <span className="text-sm font-roboto font-medium">{translatedLabel}</span>
                          )}
                        </Button>
                      </TooltipTrigger>
                      {collapsed && !isMobile && (
                        <TooltipContent side="right">{translatedLabel}</TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
              </nav>
            </TooltipProvider>
          </div>

          {/* FOOTER */}
          <div className="px-2 space-y-3">
            {/* Logout */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      useAuthStore.getState().logout();
                      navigate("/login");
                    }}
                    className={`w-full flex items-center gap-2 text-gray-700 border-gray-300 hover:bg-purple-50 py-2
                      ${collapsed && !isMobile ? "justify-center px-2" : "justify-start pl-3"}`}
                  >
                    <FiLogOut className="text-base" />
                    {(!collapsed || isMobile) && <span className="text-sm">{t('dashboard.menu.logOut')}</span>}
                  </Button>
                </TooltipTrigger>
                {collapsed && !isMobile && <TooltipContent>{t('dashboard.menu.logOut')}</TooltipContent>}
              </Tooltip>
            </TooltipProvider>

            {/* Avatar */}
            <div
              className={`flex cursor-pointer hover:bg-purple-50 rounded-lg p-2 transition-colors ${collapsed && !isMobile ? "justify-center" : "items-center gap-2"}`}
              onClick={() => {
                // Navigate to profile based on role
                if (role === 'driver') {
                  navigate('/driver-profile');
                } else {
                  // Admin, staff, and users all go to user-profile
                  navigate('/user-profile');
                }
              }}
            >
              <Avatar className={collapsed && !isMobile ? "w-8 h-8" : "w-9 h-9"}>
                <AvatarImage src={userImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(userName)} alt={userName} />
                <AvatarFallback>{userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</AvatarFallback>
              </Avatar>

              {(!collapsed || isMobile) && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-roboto font-medium truncate">{userName}</p>
                  <p className="text-[10px] font-roboto text-gray-500 truncate">{userEmail}</p>
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
