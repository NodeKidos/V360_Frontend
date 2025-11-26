import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../AdminSidebar";
import { useState, useEffect } from "react";
import TopBar from "../../Topbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditStaff() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get staff id from the URL params
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [staffData, setStaffData] = useState({
    name: "",
    email: "",
    contact: "",
    accesslevel: "",
    gender: "",
    status: "",
    nic: "",
    age: "",
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Simulate fetching staff data based on the ID from the URL
    // Replace this with actual API call to fetch staff data
    const fetchedStaff = {
      id,
      name: "Alice",
      email: "alice@gmail.com",
      contact: "+94 762347830",
      accesslevel: "staff",
      gender: "Female",
      status: "Unblock",
      nic: "200080803520",
      age: "30",
    };

    setStaffData(fetchedStaff); // Set the fetched data in state
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStaffData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Staff details updated successfully!", {
      position: "top-right",
      autoClose: 2000,
    });
    setTimeout(() => {
      navigate("/staff"); // Navigate back to the staff list page
    }, 2000);
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Top Bar */}
          <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[14px] md:text-[16px] font-medium mt-4 font-poppins">
            <span className="text-gray-500 cursor-pointer" onClick={() => navigate("/staff")}>
              Staff
            </span>
            <span className="text-gray-500"><MdKeyboardArrowRight /></span>
            <span className="font-semibold text-black">Edit Staff</span>
          </div>

          {/* Form Container */}
          <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm">
            {/* Title */}
            <div>
              <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins">
                Edit Staff
              </h2>
              <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins">
                Update the details about the staff member
              </p>
            </div>

            {/* FORM START */}
            <form
              className="mt-4 md:mt-6 space-y-4 md:space-y-6"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

                {/* Staff Name */}
                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Staff Name</label>
                  <input
                    type="text"
                    name="name"
                    value={staffData.name}
                    onChange={handleInputChange}
                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={staffData.email}
                    onChange={handleInputChange}
                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Contact No</label>
                  <div className="flex items-center border border-purple-300 rounded-xl px-2 md:px-3 py-2 mt-1">
                    <select
                      className="text-gray-700 border-r pr-2 md:pr-3 mr-2 md:mr-3 outline-none text-[12px] md:text-[14px] font-poppins"
                      value={staffData.contact}
                      onChange={handleInputChange}
                    >
                      <option>🇱🇰 +94</option>
                      <option>🇮🇳 +91</option>
                      <option>🇦🇺 +61</option>
                    </select>
                    <input
                      type="text"
                      name="contact"
                      value={staffData.contact}
                      onChange={handleInputChange}
                      className="flex-1 outline-none px-2 text-[14px] md:text-[16px] font-poppins"
                    />
                  </div>
                </div>

                {/* Access Level*/}
                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Access Level</label>
                  <select
                    name="accesslevel"
                    value={staffData.accesslevel}
                    onChange={handleInputChange}
                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  >
                    <option>Staff</option>
                    <option >Admin</option>
                    <option >Manager</option>
                  </select>
                </div>
              </div>
              {/* Country + Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Age</label>
                  <input
                    type="text"
                    name="age"
                    value={staffData.age}
                    onChange={handleInputChange}
                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Gender</label>
                  <select
                    name="gender"
                    value={staffData.gender}
                    onChange={handleInputChange}
                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Status */}
                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Status</label>
                  <select
                    name="status"
                    value={staffData.status}
                    onChange={handleInputChange}
                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  >
                    <option>Select</option>
                    <option>Block</option>
                    <option>Unblock</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">NIC</label>
                  <input
                    type="text"
                    name="nic"
                    value={staffData.nic}
                    onChange={handleInputChange}
                    className="w-full border border-purple-300 rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                  />
                </div>
              </div>
              {/* ACTION BUTTONS */}
              <div className="flex flex-row sm:flex-row justify-end gap-3 md:gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/staff")}
                  className="px-6 md:px-8 py-2 md:py-3 rounded-xl border border-[#B749DB] text-[#B749DB] hover:bg-purple-50 text-[14px] md:text-[16px] font-poppins font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 md:px-8 py-2 md:py-3 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600 text-[14px] md:text-[16px] font-poppins font-medium"
                >
                  Save
                </button>
              </div>
            </form>
            {/* FORM END */}
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}
