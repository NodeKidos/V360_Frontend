import { useState } from "react";
import Sidebar from "../../components/AdminSidebar";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from "react-icons/io";
import hotelImg from "../../assets/hotels/cityof dream.jpg";
import Img1 from "../../assets/PortCity.jpg";
import Img2 from "../../assets/galleface.jpg";
import Img3 from "../../assets/lotus.jpg";
import Img4 from "../../assets/independance memorial hall.jpg";
import Img5 from "../../assets/gangaramaya temple.jpg";
import { MdOutlineModeEdit } from "react-icons/md";
import TopBar from "../../components/Topbar";

const ItinerarySummary = () => {
  const [step, setStep] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedDestinations, setExpandedDestinations] = useState([]);

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <div
        className={`flex-1 p-4 transition-all duration-300 ${
          collapsed ? "ml-2" : "ml-6"
        }`}
      >
        {/* TopBar */}
        <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <div className="bg-white border border-purple-200 rounded-2xl shadow-sm p-4 min-h-[80vh]">
          <motion.div className="space-y-6">

            {/* Main Heading for the Itinerary Summary */}
            <h1 className="text-3xl font-semibold text-[#5B247A] mb-6">Itinerary Summary</h1> {/* Added Heading */}

            {/* Step 1 – Personal Details */}
            {step === 1 && (
              <>
                <div className="mt-6 ml-5 mr-5 bg-[#B723F2]/5 border border-[#B723F2] p-4 rounded-lg font-poppins">
                  <h2 className="text-[20px] font-semibold mb-4">Personal Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 pl-15 text-[18px]">
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

                <div className="mt-6 ml-5 mr-5 bg-[#B723F2]/5 border border-[#B723F2] p-4 rounded-lg font-poppins">
                  <h2 className="text-[20px] font-semibold mb-4">Preference & Requirements</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 pl-15 text-[18px]">
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
                        <div className="flex items-center justify-between bg-[#B723F2]/5 border border-[#B723F2] rounded-md p-2 mb-2">
                          <button
                            className="w-full text-left font-semibold"
                            onClick={() => toggleDestination(location)}
                          >
                            {location}
                          </button>
                          {expandedDestinations.includes(location) ? (
                            <IoIosArrowDropupCircle className="text-[#B749DB]" />
                          ) : (
                            <IoIosArrowDropdownCircle className="text-[#B749DB]" />
                          )}
                        </div>

                        {expandedDestinations.includes(location) && (
                          <div className="bg-[#B723F2]/5 border border-[#B723F2] p-4 rounded-lg">
                            <div className="flex flex-col md:flex-row items-center">
                              <img className="w-45 h-40 rounded-md mb-4 md:mb-0" src={hotelImg} alt="Hotel" />
                              <div className="md:ml-4 font-poppins">
                                <h3 className="font-semibold text-[20px] text-[#B723F2]"> The Grand Ward Place - Colombo 7</h3>
                                <p className="font-semibold">Single Room | 1 King Bed</p>
                                <h4 className="mt-2 font-semibold">Room Features:</h4>
                                <ul className="list-disc pl-5">
                                  <li>Outdoor swimming pool</li>
                                  <li>Fitness center </li>
                                  <li>Breakfast included</li>
                                  <li>Restaurants, Coffee makers</li>
                                </ul>
                              </div>
                            </div>

                            <div className="mt-5 ml-20 mr-6 flex overflow-x-auto space-x-6">
                              <img className="w-40 h-35 rounded-md" src={Img1} alt="Port City" />
                              <img className="w-40 h-35 rounded-md" src={Img2} alt="Galle" />
                              <img className="w-40 h-35 rounded-md" src={Img3} alt="Lotus Tower" />
                              <img className="w-40 h-35 rounded-md" src={Img4} alt="Independance Memorial" />
                              <img className="w-40 h-35 rounded-md" src={Img5} alt="Gangaramaya Temple" />
                              <img className="w-40 h-35 rounded-md" src={Img5} alt="Gangaramaya Temple" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#B723F2]/5 border border-[#B723F2] p-4 mx-5 rounded-lg mt-5 font-poppins">
                  <h2 className="text-xl font-semibold mb-4">Notes</h2>
                  <p>Special Request for birthday</p>
                </div>
              </section>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-2 px-5 pb-5">
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
