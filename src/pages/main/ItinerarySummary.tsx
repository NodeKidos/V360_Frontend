import { useEffect, useState } from "react";
import Sidebar from "../../components/AdminSidebar";
import TopBar from "../../components/Topbar"; // Import TopBar
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from "react-icons/io";
import { MdOutlineModeEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import hotelImg from "../../assets/hotels/cityof dream.jpg";
import Img1 from "../../assets/PortCity.jpg";
import Img2 from "../../assets/galleface.jpg";
import Img3 from "../../assets/lotus.jpg";
import Img4 from "../../assets/independance memorial hall.jpg";
import Img5 from "../../assets/gangaramaya temple.jpg";
import { motion } from "framer-motion";
import { CiSearch } from "react-icons/ci";

const ItinerarySummary = () => {
  const [step, setStep] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedDestinations, setExpandedDestinations] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNextClick = () => {
    if (step === 1) {
      setStep(2);
      setShowDetails(true);
      window.scrollTo({
        top: document.getElementById("destination-section").offsetTop,
        behavior: "smooth"
      });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setShowDetails(false);
    }
  };

  const toggleDestination = (destination) => {
    setExpandedDestinations((prevState) =>
      prevState.includes(destination)
        ? prevState.filter((item) => item !== destination)
        : [...prevState, destination]
    );
  };

  const handleEditClick = (itineraryId: string) => {
    navigate(`/itinerary-edit/${itineraryId}`); // Navigate to the Itinerary Edit page with the itineraryId
  };

  return (
    <div className="flex w-full min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Content Area */}
      <div className={`flex-1 p-4 transition-all duration-300 ${collapsed ? "ml-2" : "ml-6"}`}>
        {/* TopBar */}
        <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

        {/* SEARCH BAR - Mobile Only */}
        <div className="mb-6 relative md:hidden">
          <div className="relative">
            <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-[20px]" />
            <input
              type="text"
              placeholder="Search here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F5F0FF] border-none rounded-xl pl-12 pr-4 py-3 text-[14px] md:text-[16px] font-poppins focus:outline-none focus:ring-2 focus:ring-[#B749DB]/20"
            />
          </div>
        </div>
        {/* Main Content */}
        <div className="bg-white border border-purple-200 rounded-2xl shadow-sm p-4 min-h-[80vh]">
          <motion.div className="space-y-6">
            {/* Main Heading for the Itinerary Summary */}
            <h1 className="text-3xl font-roboto-condensed font-semibold text-[#5B247A] mb-6">Itinerary Summary</h1>

            {/* Step 1 – Personal Details */}
            {step === 1 && (
              <>
                <div className="mt-6 lg:ml-5 lg:mr-5 bg-[#B723F2]/5 border border-[#B723F2] p-4 rounded-[25px] font-poppins">
                  <h2 className="text-[20px] font-semibold mb-4">Personal Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 pl-15 text-[18px]">
                    <div className="mb-2"><span className="font-semibold">First Name:</span> Alice</div>
                    <div className="mb-2"><span className="font-semibold">Last Name:</span> Kirstoper</div>
                    <div className="mb-2"><span className="font-semibold">Date of Birth:</span> 05.10.1994</div>
                    <div className="mb-2"><span className="font-semibold">Contact No:</span> +1 (555) 123-4567</div>
                    <div className="mb-2"><span className="font-semibold">Email Address:</span> alice@gmail.com</div>
                    <div className="mb-2"><span className="font-semibold">Country of Residence:</span> USA</div>
                    <div className="mb-2"><span className="font-semibold">Arrival Date:</span> 03.10.2025</div>
                    <div className="mb-2"><span className="font-semibold">Departure Date:</span> 03.11.2025</div>
                    <div className="mb-2"><span className="font-semibold">Preferred Duration of Stay:</span> 1 month</div>
                    <div className="mb-2"><span className="font-semibold">Group Composition:</span> 2 Adults, 2 Children</div>
                  </div>
                </div>

                <div className="mt-6 lg:ml-5 lg:mr-5 bg-[#B723F2]/5 border border-[#B723F2] p-4 rounded-[25px] font-poppins">
                  <h2 className="text-[20px] font-semibold mb-4">Preference & Requirements</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 pl-15 text-[18px]">
                    <div className="mb-2"><span className="font-semibold">Dietary Preferences:</span> Non-Veg</div>
                    <div className="mb-2"><span className="font-semibold">Hotel Category:</span> 5 Star</div>
                    <div className="mb-2"><span className="font-semibold">Room Category:</span> Single</div>
                    <div className="mb-2"><span className="font-semibold">Vehicle Type:</span> Semi-Luxury</div>
                    <div className="mb-2"><span className="font-semibold">Special Needs:</span> None</div>
                  </div>
                </div>
              </>
            )}

            {/* Step 2 – Destinations */}
            {step === 2 && showDetails && (
              <section id="destination-section" className="container mx-auto">
                <div className="p-5 font-poppins">
                  <h2 className="text-xl font-semibold mb-2">Destinations</h2>
                  <div className="space-y-4">
                    {["Colombo", "Kandy", "Galle"].map((location) => (
                      <div key={location}>
                        <div className="flex items-center justify-between bg-[#B723F2]/5 border border-[#B723F2] rounded-[25px] p-2 mb-2">
                          <button
                            className="w-full text-left font-semibold ml-4 text-[18px]"
                            onClick={() => toggleDestination(location)}
                          >
                            {location}
                          </button>
                          {expandedDestinations.includes(location) ? (
                            <IoIosArrowDropupCircle className="text-[#B749DB] w-10 h-6" />
                          ) : (
                            <IoIosArrowDropdownCircle className="text-[#B749DB] w-10 h-6" />
                          )}
                        </div>

                        {expandedDestinations.includes(location) && (
                          <div className="bg-[#F8EDFC] border border-[#D9B7F2] p-5 rounded-[25px] shadow-sm">

                            {/* TOP SECTION */}
                            <div className="flex flex-col lg:flex-row gap-6">

                              {/* HOTEL IMAGE */}
                              <img
                                src={hotelImg}
                                className="w-full sm:w-56 lg:w-60 h-40 object-cover rounded-xl"
                                alt="Hotel"
                              />

                              {/* DETAILS SECTION */}
                              <div className="flex-1">

                                {/* TITLE + RATING */}
                                <div className="flex items-start justify-between gap-3">
                                  <h3 className="text-[20px] font-semibold text-[#7A1CAC]">
                                    The Grand Ward Place – Colombo 7
                                  </h3>

                                  {/* Stars */}
                                  <div className="flex text-yellow-400 text-xl">
                                    ★★★★☆
                                  </div>
                                </div>

                                {/* TAGS */}
                                <div className="flex flex-wrap gap-3 mt-3">
                                  <span className="px-4 py-1 bg-white border border-[#CBA5EF] rounded-full text-sm flex items-center gap-2">
                                    🛏 Single Room
                                  </span>

                                  <span className="px-4 py-1 bg-white border border-[#CBA5EF] rounded-full text-sm flex items-center gap-2">
                                    👑 1 King Bed
                                  </span>

                                  <span className="px-4 py-1 bg-white border border-[#CBA5EF] rounded-full text-sm flex items-center gap-2">
                                    🏨 Double Room
                                  </span>
                                </div>

                                {/* FEATURES */}
                                <h4 className="font-semibold mt-4 mb-2 text-[16px]">Room Features</h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[15px] leading-relaxed">
                                  <ul className="list-disc ml-6 space-y-1">
                                    <li>Outdoor swimming pool</li>
                                    <li>Airport shuttle</li>
                                    <li>Free Wifi</li>
                                    <li>Family rooms</li>
                                    <li>Spa</li>
                                  </ul>

                                  <ul className="list-disc ml-6 space-y-1">
                                    <li>Fitness center</li>
                                    <li>3 restaurants</li>
                                    <li>Tea/Coffee Maker in All Rooms</li>
                                    <li>Bar</li>
                                    <li>Wonderful Breakfast</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* IMAGE CAROUSEL */}
                            <div className="mt-5 ml-6 mr-6 flex overflow-x-auto space-x-6">

                              {[
                                { img: Img3, name: "Lotus Tower" },
                                { img: Img1, name: "Port City" },
                                { img: Img2, name: "Galle Face Beach" },
                                { img: Img5, name: "Gangaramaya Temple" },
                                { img: Img4, name: "Independence Memorial Hall" }
                              ].map((item, index) => (
                                <div key={index} className="relative shrink-0">

                                  {/* IMAGE */}
                                  <img
                                    src={item.img}
                                    className="w-full h-36 object-cover rounded-xl"
                                    alt={item.name}
                                  />

                                  {/* TEXT OVERLAY */}
                                  <div
                                    className="absolute bottom-0 left-0 w-full bg-black/60 text-white rounded-b-xl py-1 px-2"
                                  >
                                    <p className="text-[16px] font-normal font-poppins truncate">{item.name}</p>
                                  </div>

                                </div>
                              ))}

                            </div>


                            {/* DOT INDICATORS */}
                            <div className="flex justify-center mt-3 gap-2">
                              <span className="w-3 h-3 bg-[#D19CF8] rounded-full"></span>
                              <span className="w-3 h-3 bg-[#C38AF2] rounded-full"></span>
                              <span className="w-3 h-3 bg-[#B777EE] rounded-full"></span>
                              <span className="w-3 h-3 bg-[#C38AF2] rounded-full"></span>
                              <span className="w-3 h-3 bg-[#D19CF8] rounded-full"></span>
                            </div>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#B723F2]/5 border border-[#B723F2] p-4 mx-5 rounded-[25px] mt-5 font-poppins">
                  <h2 className="text-xl font-semibold mb-4">Notes</h2>
                  <p>Special Request for birthday</p>
                </div>
              </section>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-2 px-5 pb-5 gap-5">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 border cursor-pointer border-[#B749DB] text-[#5B247A] font-semibold px-6 py-2 rounded-lg"
                >
                  <FaArrowLeft className="text-[#B749DB]" /> Previous
                </button>
              )}

              {step < 2 ? (
                <button
                  onClick={handleNextClick}
                  className="flex items-center cursor-pointer gap-2 border border-[#B749DB] text-[#5B247A] font-semibold px-6 py-2 rounded-lg ml-auto"
                >
                  Next <FaArrowRight className="text-[#B749DB]" />
                </button>
              ) : (
                <button
                  onClick={handleEditClick} // Click to edit the itinerary
                  className="flex items-center cursor-pointer gap-2 border border-[#B749DB] text-[#5B247A] font-semibold px-6 py-2 rounded-lg"
                >
                  <MdOutlineModeEdit className="text-[#B749DB]" /> Edit
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ItinerarySummary;
