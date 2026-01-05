import { CiSearch } from "react-icons/ci";
import Sidebar from "../AdminSidebar";
import { useState, useEffect } from "react";
import TopBar from "../Topbar";
import { useNavigate } from "react-router-dom";

import Colombo from "../../assets/PortCity.jpg";
import Badulla from "../../assets/sustainablityImage/nineedge.jpg";
import Galle from "../../assets/sustainablityImage/gallefort.jpg";
import Matale from "../../assets/waterfall.jpg";
import Anurathapura from "../../assets/sustainablityImage/elephant.jpg";
import Kandy from "../../assets/Swing.jpg";

const TripPhotos = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const destinations = [
    { id: "colombo", name: "Colombo", cover: Colombo },
    { id: "kandy", name: "Kandy", cover: Kandy },
    { id: "galle", name: "Galle", cover: Galle },
    { id: "anuradhapura", name: "Anurathapura", cover: Anurathapura },
    { id: "matale", name: "Matale", cover: Matale },
    { id: "badulla", name: "Badulla", cover: Badulla },
  ];

  const filteredDestinations = destinations.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ FIXED: match your route "/memories/:place"
  const goToGallery = (id: string, name: string) => {
    navigate(`/memories/${id}`, { state: { name } });
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className={`flex-1 p-4 transition-all duration-300 ${
          collapsed ? "ml-2" : "ml-6"
        }`}
      >
        <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

        {/* SEARCH BAR - Mobile Only */}
        <div className="mb-6 relative md:hidden">
          <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]" />
          <input
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F5F0FF] border-none rounded-xl pl-12 pr-4 py-3 text-[14px] md:text-[16px] font-poppins focus:outline-none focus:ring-2 focus:ring-[#B749DB]/20"
          />
        </div>

        <h2 className="text-3xl font-bold text-black mb-4">Memories</h2>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDestinations.map((d) => (
            <div
              key={d.id}
              className="relative cursor-pointer group"
              onClick={() => goToGallery(d.id, d.name)}
            >
              <img
                src={d.cover}
                alt={d.name}
                className="w-full h-60 object-cover rounded-lg shadow-md"
              />

              <div className="absolute p-2 bottom-0 left-0 text-white bg-black/60 rounded-b-lg w-full font-semibold text-xl">
                {d.name}
              </div>

              <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/10 transition" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripPhotos;
