import { CiSearch } from "react-icons/ci";
import Sidebar from "../AdminSidebar";
import { useState, useEffect } from "react";
import TopBar from "../Topbar";
import { useNavigate, useLocation } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

import Colombo from "../../assets/PortCity.jpg";
import { itineraryService } from "../../services/itinerary.service";
import type { Itinerary } from "../../types/itinerary.types";
import { Loader } from "../ui/Loader";

const TripPhotos = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const data = await itineraryService.getMyItineraries();
        // Filter for itineraries that are in progress, completed, or accepted (has been formalised)
        const activeItineraries = data.filter(itn =>
          ['accepted', 'in_progress', 'completed'].includes(itn.status)
        );
        setItineraries(activeItineraries);

        // Check if we returned from a gallery with a selected itinerary
        const stateId = (location.state as any)?.selectedItineraryId;
        if (stateId) {
          const found = activeItineraries.find(itn => itn.id === stateId);
          if (found) {
            setSelectedItinerary(found);
          }
        }
      } catch (error) {
        console.error("Failed to fetch itineraries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItineraries();
  }, [location.state]);

  const filtered = itineraries.filter((itn) =>
    itn.itineraryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    itn.days?.[0]?.destination?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectItinerary = (itn: Itinerary) => {
    setSelectedItinerary(itn);
  };

  const goToGallery = (itineraryId: string, destinationId: string, name: string) => {
    navigate(`/memories/${itineraryId}`, { state: { name, destinationId } });
  };

  // Get unique destinations from itinerary days
  const getDestinations = (itn: Itinerary) => {
    const destinations: any[] = [];
    const seen = new Set();

    itn.days?.forEach(day => {
      if (day.destination && !seen.has(day.destination.id)) {
        seen.add(day.destination.id);
        destinations.push(day.destination);
      }
    });

    return destinations;
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
        className={`flex-1 p-4 transition-all duration-300 ${collapsed ? "ml-2" : "ml-6"
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

        {selectedItinerary ? (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSelectedItinerary(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <IoArrowBackOutline className="text-2xl" />
              </button>
              <div>
                <h2 className="text-3xl font-bold text-black">
                  {selectedItinerary.itineraryNumber}
                </h2>
                <p className="text-gray-500">Pick a destination to view memories</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {getDestinations(selectedItinerary).map((dest) => (
                <div
                  key={dest.id}
                  className="relative cursor-pointer group"
                  onClick={() => goToGallery(selectedItinerary.id, dest.id, dest.name)}
                >
                  <img
                    src={dest.image || Colombo}
                    alt={dest.name}
                    className="w-full h-60 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute p-2 bottom-0 left-0 text-white bg-black/60 rounded-b-lg w-full font-semibold text-lg">
                    {dest.name}
                  </div>
                  <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/10 transition" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-black mb-4">Memory Books</h2>

            {loading ? (
              <Loader size={100} />
            ) : filtered.length > 0 ? (
              <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((itn) => (
                  <div
                    key={itn.id}
                    className="relative cursor-pointer group"
                    onClick={() => selectItinerary(itn)}
                  >
                    <img
                      src={itn.days?.[0]?.destination?.image || Colombo}
                      alt={itn.itineraryNumber}
                      className="w-full h-60 object-cover rounded-lg shadow-md"
                    />

                    <div className="absolute p-2 bottom-0 left-0 text-white bg-black/60 rounded-b-lg w-full font-semibold text-lg">
                      <div>{itn.itineraryNumber}</div>
                      <div className="text-sm font-normal text-gray-200">
                        {itn.days?.[0]?.destination?.name || "Tour"} trip
                      </div>
                    </div>

                    <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/10 transition" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No active trips with memories found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TripPhotos;
