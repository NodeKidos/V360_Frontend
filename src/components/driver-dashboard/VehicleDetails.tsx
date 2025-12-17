import { useState, useEffect, type SetStateAction } from "react";
import Sidebar from "../AdminSidebar";
import TopBar from "../Topbar"; // Import TopBar
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { motion } from "framer-motion";
import { CiSearch } from "react-icons/ci";

// Import images from the src folder
import Img1 from "../../assets/vehicledetails/img1.png";
import Img2 from "../../assets/vehicledetails/img2.png";
import Img3 from "../../assets/vehicledetails/img3.png";
import Img4 from "../../assets/vehicledetails/img4.png";

// Vehicle Details - Now includes two vehicles
const vehicleDetails = [
  {
    id: "VI1001",
    name: "TOYOTA CAMRY",
    model: "TOYOTA",
    type: "Car",
    plate: "NP QI-9504",
    seatCount: 3,
    images: [Img1, Img2, Img3, Img4], // Added the images
    status: "Active", // Default status is Active
    note: "", // Note for the vehicle
  },
  {
    id: "VI1002",
    name: "HONDA ACCORD",
    model: "HONDA",
    type: "Car",
    plate: "NP QI-9505",
    seatCount: 5,
    images: [Img1, Img2, Img3, Img4], // Reuse or add different images
    status: "In Service", // Default status is In Service
    note: "", // Note for the vehicle
  },
];

const VehicleDetails = () => {
  const [step, setStep] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [vehicles, setVehicles] = useState(vehicleDetails);
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [note, setNote] = useState("");
  const [modalType, setModalType] = useState(""); // To differentiate between "Need Repair" and "In Service"

  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setShowDetails(false);
    }
  };

  const handleButtonClick = (vehicleId: string, status: any) => {
    // Update vehicle status
    const updatedVehicles = vehicles.map((vehicle) =>
      vehicle.id === vehicleId ? { ...vehicle, status } : vehicle
    );
    setVehicles(updatedVehicles);
  };

  const openModal = (vehicle: SetStateAction<null>, type: SetStateAction<string>) => {
    // Only open the modal if the status is "Need Repair" or "In Service"
    if (type === "Need Repair" || type === "In Service") {
      setSelectedVehicle(vehicle);
      setModalType(type);
      setShowModal(true);
    }
  };

  const handleSaveNote = () => {
    const updatedVehicles = vehicles.map((vehicle) =>
      vehicle.id === selectedVehicle.id ? { ...vehicle, note } : vehicle
    );
    setVehicles(updatedVehicles);
    setShowModal(false);
    setNote("");
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
        <div className="bg-white p-4 min-h-[80vh]">
          <motion.div className="space-y-6">
            {/* Main Heading for Vehicle Details */}
            <h1 className="text-3xl font-roboto-condensed font-semibold text-[#5B247A] mb-6">Vehicle Details</h1>

            {/* Mapping through vehicle details to show each vehicle */}
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="mt-6 lg:ml-5 lg:mr-5 bg-[#B723F2]/5 border border-[#B723F2] p-4 rounded-[25px] font-poppins">
                <div className="flex justify-between items-start mb-4">
                  {/* Vehicle Information Heading */}
                  <h2 className="text-[20px] font-semibold">Vehicle Information</h2>

                  {/* Buttons for "Need Repair", "In Service", "Active" */}
                  <div className="flex space-x-4">
                    <button
                      className={`bg-white border border-[#B723F2] text-black p-3 rounded-[15px] font-roboto-condensed ${
                        vehicle.status === "Need Repair" ? "bg-red-500" : ""
                      }`}
                      onClick={() => openModal(vehicle, "Need Repair")}
                    >
                      Need Repair
                    </button>
                    <button
                      className={`bg-white border border-[#B723F2] text-black p-3 rounded-[15px] font-roboto-condensed ${
                        vehicle.status === "In Service" ? "bg-yellow-500" : ""
                      }`}
                      onClick={() => openModal(vehicle, "In Service")}
                    >
                      In Service
                    </button>
                    <button
                      className={`bg-white border border-[#B723F2] text-black p-3 rounded-[15px] font-roboto-condensed ${
                        vehicle.status === "Active" ? "bg-green-500" : ""
                      }`}
                      onClick={() => openModal(vehicle, "Active")}
                    >
                      Active
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 pl-15 text-[18px] font-roboto">
                  <div className="mb-2">
                    <span className="font-semibold">Vehicle Id:</span> {vehicle.id}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Vehicle Model:</span> {vehicle.model}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Vehicle Type:</span> {vehicle.type}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Vehicle No Plate:</span> {vehicle.plate}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Seat Count:</span> {vehicle.seatCount}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Vehicle Status:</span> {vehicle.status}
                  </div>
                </div>

                {/* Vehicle Images */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {vehicle.images.map((img, index) => (
                    <img key={index} src={img} alt={`Vehicle Image ${index + 1}`} className="w-full h-50 rounded-lg shadow-md" />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Modal for writing a note */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              Add a Note for {selectedVehicle?.name}
            </h3>
            <p className="text-gray-500 mb-4">
              Please describe your concern or the specific change you would like:
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-32 p-2 border border-gray-300 rounded-lg"
              placeholder="Enter note here..."
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white p-2 rounded-lg mr-2"
                onClick={handleSaveNote}
              >
                Submit
              </button>
              <button
                className="bg-gray-500 text-white p-2 rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetails;
