import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../AdminSidebar";
import { useState, useEffect } from "react";
import TopBar from "../../Topbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import vehicleService from "../../../services/vehicle.service";
import { adminDriverService, type Driver } from "../../../services/admin.service";
import { Loader } from "../../ui/Loader";

export default function EditVehicle() {
  const navigate = useNavigate();
  const { vehicleId } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'maintenance' | 'assignment'>('basic');

  const [vehicleData, setVehicleData] = useState<{
    // Basic Info
    vehicleName: string;
    vehicleType: string;
    vehicleNoPlate: string;
    vehicleModel: string;
    year: string;
    color: string;
    seatCount: string;
    fuelType: string;
    pricePerDay: string;
    status: string;
    // Maintenance
    mileage: string;
    lastMaintenanceDate: string;
    nextServiceDate: string;
    insuranceExpiry: string;
    // Assignment
    assignDriver: string;
    // Image
    vehicleImage: File | null;
  }>({
    vehicleName: "",
    vehicleType: "",
    vehicleNoPlate: "",
    vehicleModel: "",
    year: new Date().getFullYear().toString(),
    color: "",
    seatCount: "",
    fuelType: "diesel",
    pricePerDay: "0",
    status: "Active",
    mileage: "0",
    lastMaintenanceDate: "",
    nextServiceDate: "",
    insuranceExpiry: "",
    assignDriver: "",
    vehicleImage: null,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await adminDriverService.getAllDrivers();
        setDrivers(response.drivers || []);
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
        toast.error("Failed to load drivers list");
      }
    };
    fetchDrivers();
  }, []);

  // Fetch vehicle data
  useEffect(() => {
    const fetchVehicle = async () => {
      if (!vehicleId) {
        toast.error("Vehicle ID not found");
        navigate("/vehicle");
        return;
      }

      try {
        setFetchLoading(true);
        const vehicle = await vehicleService.getVehicleById(vehicleId);

        let displayStatus = "Active";
        if (vehicle.status === "available") displayStatus = "Active";
        else if (vehicle.status === "in_use") displayStatus = "In Service";
        else if (vehicle.status === "maintenance" || vehicle.status === "out_of_service") displayStatus = "Need Repair";

        let assignedDriverId = "";
        if ((vehicle as any).assignedDrivers && Array.isArray((vehicle as any).assignedDrivers) && (vehicle as any).assignedDrivers.length > 0) {
          assignedDriverId = (vehicle as any).assignedDrivers[0].id || "";
        } else if ((vehicle as any).drivers && Array.isArray((vehicle as any).drivers) && (vehicle as any).drivers.length > 0) {
          assignedDriverId = (vehicle as any).drivers[0].id || "";
        }

        setVehicleData({
          vehicleName: vehicle.make || "",
          vehicleType: vehicle.type || "",
          vehicleNoPlate: vehicle.registrationNumber || "",
          vehicleModel: vehicle.model || "",
          year: vehicle.year?.toString() || new Date().getFullYear().toString(),
          color: vehicle.color || "",
          seatCount: vehicle.seatingCapacity?.toString() || vehicle.capacity?.toString() || "",
          fuelType: vehicle.fuelType || "diesel",
          pricePerDay: vehicle.pricePerDay?.toString() || "0",
          status: displayStatus,
          mileage: vehicle.mileage?.toString() || "0",
          lastMaintenanceDate: vehicle.lastMaintenanceDate ? new Date(vehicle.lastMaintenanceDate).toISOString().split('T')[0] : "",
          nextServiceDate: vehicle.nextServiceDate ? new Date(vehicle.nextServiceDate).toISOString().split('T')[0] : "",
          insuranceExpiry: vehicle.insuranceExpiry ? new Date(vehicle.insuranceExpiry).toISOString().split('T')[0] : "",
          assignDriver: assignedDriverId,
          vehicleImage: null,
        });
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch vehicle data");
        navigate("/vehicle");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId) return;

    // Validation
    if (!vehicleData.vehicleName || !vehicleData.vehicleType || !vehicleData.vehicleNoPlate ||
      !vehicleData.vehicleModel || !vehicleData.seatCount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      let mappedStatus = "available";
      if (vehicleData.status === "Active") mappedStatus = "available";
      else if (vehicleData.status === "In Service") mappedStatus = "in_use";
      else if (vehicleData.status === "Need Repair") mappedStatus = "maintenance";

      let mappedType = vehicleData.vehicleType.toLowerCase();
      if (mappedType === "car") mappedType = "sedan";

      await vehicleService.updateVehicle(vehicleId, {
        registrationNumber: vehicleData.vehicleNoPlate,
        type: mappedType,
        make: vehicleData.vehicleName,
        model: vehicleData.vehicleModel,
        year: parseInt(vehicleData.year),
        color: vehicleData.color,
        seatingCapacity: parseInt(vehicleData.seatCount),
        fuelType: vehicleData.fuelType,
        pricePerDay: parseFloat(vehicleData.pricePerDay),
        mileage: parseInt(vehicleData.mileage),
        lastMaintenanceDate: vehicleData.lastMaintenanceDate || undefined,
        nextServiceDate: vehicleData.nextServiceDate || undefined,
        insuranceExpiry: vehicleData.insuranceExpiry || undefined,
        status: mappedStatus,
      });

      // Handle driver assignment
      if (vehicleData.assignDriver && vehicleData.assignDriver !== "") {
        await vehicleService.assignDriver(vehicleId, vehicleData.assignDriver);
      }

      toast.success("Vehicle updated successfully!");
      setTimeout(() => navigate("/vehicle"), 2000);
    } catch (error: any) {
      console.error("Update failed", error);
      const errorMessage = error?.response?.data?.message || "Failed to update vehicle";
      const displayMsg = Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage;
      toast.error(displayMsg);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'maintenance', label: 'Maintenance & Service' },
    { id: 'assignment', label: 'Driver Assignment' },
  ];

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-4 md:p-6 lg:p-8">
          <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[14px] md:text-[16px] font-medium mt-4 font-poppins">
            <span className="text-gray-500 cursor-pointer" onClick={() => navigate("/vehicle")}>
              Vehicle
            </span>
            <span className="text-gray-500"><MdKeyboardArrowRight /></span>
            <span className="font-semibold text-black">Edit Vehicle</span>
          </div>

          {/* Form Container */}
          {fetchLoading ? (
            <Loader src="/loaders/travelloading.lottie" message="Loading vehicle..." size={250} />
          ) : (
            <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm">
              {/* Title */}
              <div>
                <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins">
                  Edit Vehicle
                </h2>
                <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins">
                  Update vehicle details, maintenance records, and driver assignments
                </p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mt-6 border-b border-gray-200 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 md:px-6 py-2 md:py-3 font-medium transition-colors whitespace-nowrap font-poppins text-[14px] md:text-[16px] ${activeTab === tab.id
                        ? 'text-[#B749DB] border-b-2 border-[#B749DB]'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* FORM */}
              <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                {/* BASIC INFO TAB */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    {/* Vehicle Name + Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">
                          Vehicle Make<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="vehicleName"
                          value={vehicleData.vehicleName}
                          onChange={handleChange}
                          required
                          className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                          placeholder="e.g., Toyota"
                        />
                      </div>

                      <div>
                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">
                          Vehicle Model<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="vehicleModel"
                          value={vehicleData.vehicleModel}
                          onChange={handleChange}
                          required
                          className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                          placeholder="e.g., KDH"
                        />
                      </div>
                    </div>

                    {/* Type + Registration Number */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">
                          Vehicle Type<span className="text-red-500">*</span>
                        </label>
                        <select
                          name="vehicleType"
                          value={vehicleData.vehicleType}
                          onChange={handleChange}
                          required
                          className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                        >
                          <option value="">Select Type</option>
                          <option value="sedan">Sedan</option>
                          <option value="suv">SUV</option>
                          <option value="van">Van</option>
                          <option value="minibus">Minibus</option>
                          <option value="bus">Bus</option>
                          <option value="luxury">Luxury</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">
                          Registration Number<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="vehicleNoPlate"
                          value={vehicleData.vehicleNoPlate}
                          onChange={handleChange}
                          required
                          className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                          placeholder="e.g., ABC-1234"
                        />
                      </div>
                    </div>

                    {/* Year + Color */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">
                          Year<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="year"
                          value={vehicleData.year}
                          onChange={handleChange}
                          min="1900"
                          max="2100"
                          required
                          className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                        />
                      </div>

                      <div>
                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">
                          Color
                        </label>
                        <input
                          type="text"
                          name="color"
                          value={vehicleData.color}
                          onChange={handleChange}
                          className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                          placeholder="e.g., White"
                        />
                      </div>
                    </div>

                    {/* Seat Count + Fuel Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">
                          Seating Capacity<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="seatCount"
                          value={vehicleData.seatCount}
                          onChange={handleChange}
                          min="1"
                          required
                          className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                        />
                      </div>

                      <div>
                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">
                          Fuel Type<span className="text-red-500">*</span>
                        </label>
                        <select
                          name="fuelType"
                          value={vehicleData.fuelType}
                          onChange={handleChange}
                          required
                          className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                        >
                          <option value="diesel">Diesel</option>
                          <option value="petrol">Petrol</option>
                          <option value="electric">Electric</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                      </div>
                    </div>

                    {/* Price Per Day + Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">
                          Price Per Day (LKR)
                        </label>
                        <input
                          type="number"
                          name="pricePerDay"
                          value={vehicleData.pricePerDay}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                        />
                      </div>

                      <div>
                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">
                          Status<span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4 mt-3">
                          <label className="flex items-center">
                            <input type="radio" name="status" value="Active" checked={vehicleData.status === "Active"} onChange={handleChange} className="mr-2" />
                            <span className="text-gray-700">Active</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="status" value="In Service" checked={vehicleData.status === "In Service"} onChange={handleChange} className="mr-2" />
                            <span className="text-gray-700">In Service</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="status" value="Need Repair" checked={vehicleData.status === "Need Repair"} onChange={handleChange} className="mr-2" />
                            <span className="text-gray-700">Need Repair</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MAINTENANCE TAB */}
                {activeTab === 'maintenance' && (
                  <div className="space-y-6">
                    {/* Mileage + Insurance Expiry */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">
                          Current Mileage (km)
                        </label>
                        <input
                          type="number"
                          name="mileage"
                          value={vehicleData.mileage}
                          onChange={handleChange}
                          min="0"
                          className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                        />
                      </div>

                      <div>
                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">
                          Insurance Expiry Date
                        </label>
                        <input
                          type="date"
                          name="insuranceExpiry"
                          value={vehicleData.insuranceExpiry}
                          onChange={handleChange}
                          className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                        />
                      </div>
                    </div>

                    {/* Last Service Date + Next Service Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">
                          Last Service Date
                        </label>
                        <input
                          type="date"
                          name="lastMaintenanceDate"
                          value={vehicleData.lastMaintenanceDate}
                          onChange={handleChange}
                          className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                        />
                      </div>

                      <div>
                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">
                          Next Service Due Date
                        </label>
                        <input
                          type="date"
                          name="nextServiceDate"
                          value={vehicleData.nextServiceDate}
                          onChange={handleChange}
                          className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                        />
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <p className="text-gray-700 text-[13px] md:text-[14px] font-poppins">
                        <strong>Maintenance Tip:</strong> Regular servicing extends vehicle lifespan and ensures passenger safety.
                        Recommended service interval: Every 6 months or 10,000 km, whichever comes first.
                      </p>
                    </div>
                  </div>
                )}

                {/* ASSIGNMENT TAB */}
                {activeTab === 'assignment' && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">
                        Assign Driver (Optional)
                      </label>
                      <select
                        name="assignDriver"
                        value={vehicleData.assignDriver}
                        onChange={handleChange}
                        className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                      >
                        <option value="">
                          {drivers.length === 0 ? "No drivers available" : "Select a driver (optional)"}
                        </option>
                        {drivers.map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name || `${driver.firstName || ''} ${driver.lastName || ''}`.trim() || 'Unknown Driver'}
                          </option>
                        ))}
                      </select>
                      {drivers.length === 0 && (
                        <p className="text-gray-500 text-[12px] mt-2">
                          No drivers found. Please add drivers first.
                        </p>
                      )}
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-gray-700 text-[13px] md:text-[14px] font-poppins">
                        <strong>Note:</strong> Driver assignment is optional. Vehicles can be assigned to drivers later,
                        and multiple vehicles can be assigned to a single driver for different trips.
                      </p>
                    </div>
                  </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="flex flex-row sm:flex-row justify-end gap-3 md:gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate("/vehicle")}
                    className="px-6 md:px-8 py-2 md:py-3 rounded-xl border border-[#B749DB] text-[#B749DB] hover:bg-purple-50 text-[14px] md:text-[16px] font-poppins font-medium"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 md:px-8 py-2 md:py-3 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600 text-[14px] md:text-[16px] font-poppins font-medium disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Update Vehicle"}
                  </button>
                </div>
              </form>
            </div>
          )}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}
