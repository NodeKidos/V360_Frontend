import { useState, useEffect } from "react";
import Sidebar from "../AdminSidebar";
import TopBar from "../Topbar";
// import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

// Import images from the src folder
import Img1 from "../../assets/vehicledetails/img1.png";
import Img2 from "../../assets/vehicledetails/img2.png";
import Img3 from "../../assets/vehicledetails/img3.png";
import Img4 from "../../assets/vehicledetails/img4.png";

interface Vehicle {
  id: string;
  name: string;
  model: string;
  type: string;
  plate: string;
  seatCount: number;
  images: string[];
  status: string;
  note: string;
}

// Vehicle Details - Now includes two vehicles
const vehicleDetails: Vehicle[] = [
  {
    id: "VI1001",
    name: "TOYOTA CAMRY",
    model: "TOYOTA",
    type: "Car",
    plate: "NP QI-9504",
    seatCount: 3,
    images: [Img1, Img2, Img3, Img4],
    status: "Active",
    note: "",
  },
  {
    id: "VI1002",
    name: "HONDA ACCORD",
    model: "HONDA",
    type: "Car",
    plate: "NP QI-9505",
    seatCount: 5,
    images: [Img1, Img2, Img3, Img4],
    status: "In Service",
    note: "",
  },
];

const VehicleDetails = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [vehicles, setVehicles] = useState<Vehicle[]>(vehicleDetails);
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openModal = (vehicle: Vehicle, type: string) => {
    if (type === "Need Repair" || type === "In Service" || type === "Active") {
      setSelectedVehicle(vehicle);
      setShowModal(true);
    }
  };

  const handleSaveNote = () => {
    if (!selectedVehicle) return;

    const updatedVehicles = vehicles.map((vehicle) =>
      vehicle.id === selectedVehicle.id ? { ...vehicle, note } : vehicle
    );
    setVehicles(updatedVehicles);
    setShowModal(false);
    setNote("");
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-6">
          <TopBar
            isMobile={isMobile}
            setSidebarOpen={setSidebarOpen}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <div className="mb-4 mt-4 hidden md:flex md:justify-between md:items-center">
            <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px] md:text-[36px] lg:text-[40px] xl:text-[48px]">
              Vehicle Details
            </h2>
          </div>
          {/* TITLE - Mobile */}
          <div className="mb-4 mt-4 md:hidden">
            <h2 className="font-poppins font-bold text-black text-[24px] sm:text-[30px]">
              Vehicle Details
            </h2>
          </div>

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

          {/* Mapping through vehicle details to show each vehicle */}
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="mt-6 lg:ml-5 lg:mr-5 bg-[#B723F2]/5 border border-[#B723F2] p-4 rounded-[25px] font-poppins">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-[20px] font-semibold">Vehicle Information</h2>

                <div className="flex space-x-4">
                  <button
                    className={`bg-white border border-[#B723F2] text-black p-3 rounded-[15px] font-roboto-condensed ${vehicle.status === "Need Repair" ? "bg-red-500" : ""}`}
                    onClick={() => openModal(vehicle, "Need Repair")}
                  >
                    Need Repair
                  </button>
                  <button
                    className={`bg-white border border-[#B723F2] text-black p-3 rounded-[15px] font-roboto-condensed ${vehicle.status === "In Service" ? "bg-yellow-500" : ""}`}
                    onClick={() => openModal(vehicle, "In Service")}
                  >
                    In Service
                  </button>
                  <button
                    className={`bg-white border border-[#B723F2] text-black p-3 rounded-[15px] font-roboto-condensed ${vehicle.status === "Active" ? "bg-green-500" : ""}`}
                    onClick={() => openModal(vehicle, "Active")}
                  >
                    Active
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 lg:pl-16 text-[18px] font-roboto text-gray-800">
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
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {vehicle.images.map((img, index) => (
                  <img key={index} src={img} alt={`Vehicle Image ${index + 1}`} className="w-full aspect-square object-cover rounded-lg shadow-md" />
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Modal for writing a note */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h3 className="text-xl font-semibold mb-4">
              Add a Note for {selectedVehicle?.name}
            </h3>
            <p className="text-gray-500 mb-4">
              Please describe your concern or the specific change you would like:
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="Enter note here..."
            />
            <div className="flex justify-end mt-6 gap-3">
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={handleSaveNote}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetails;
