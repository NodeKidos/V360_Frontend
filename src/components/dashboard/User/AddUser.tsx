import { useNavigate } from "react-router-dom";
import Sidebar from "../../AdminSidebar";
import { useState, useEffect } from "react";
import TopBar from "../../Topbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function AddCustomer() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isIPad, setIsIPad] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [isDesktopMain, setIsDesktopMain] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsIPad(width >= 768 && width < 1024);
      setIsDesktopMain(width >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-white flex">

      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col p-4 md:p-8">

        {/* Top Bar */}
        <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

        {/* Search — Mobile Only */}
        {isMobile && (
          <div className="bg-[#f7e8ff] rounded-xl flex items-center gap-3 px-4 py-3 mb-6">
            <i className="fas fa-search text-[#B749DB]"></i>
            <input
              type="text"
              placeholder="Search here"
              className="w-full bg-transparent outline-none text-[#6b6b6b]"
            />
          </div>
        )}

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[16px] font-medium mt-4 font-roboto">
          <span className="text-gray-500 cursor-pointer" onClick={() => navigate("/user")}>
            Customer
          </span>
          <span className="text-gray-500"><MdKeyboardArrowRight /></span>
          <span className="font-semibold text-black">Add Customer</span>
        </div>

        {/* Form Container */}
        <div className="mt-6 bg-white shadow- rounded-2xl p-6 md:p-10 border border-purple-100">

          {/* Title */}
          <div>
            <h2 className="text-[22px] font-semibold text-[#B749DB]">
              Add a Customer
            </h2>
            <p className="text-gray-500 text-[14px] mt-1">
              Details about Customer
            </p>
          </div>

          {/* FORM START */}
         <form
            className="mt-6 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Customer added successfully!", {
                position: "top-right",
                autoClose: 2000,
              });
            }}
          >

            {/* Customer Name */}
            <div>
              <label className="text-gray-700 text-[15px]">Customer Name</label>
              <input
                type="text"
                className="w-full border border-purple-300 rounded-xl mt-1 px-4 py-3 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-700 text-[15px]">Email Address</label>
              <input
                type="email"
                className="w-full border border-purple-300 rounded-xl mt-1 px-4 py-3 outline-none"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="text-gray-700 text-[15px]">Contact No</label>

              <div className="flex items-center border border-purple-300 rounded-xl px-3 py-2 mt-1">
                <select className="text-gray-700 border-r pr-3 mr-3 outline-none">
                  <option>🇱🇰 +94</option>
                  <option>🇮🇳 +91</option>
                  <option>🇦🇺 +61</option>
                </select>
                <input
                  type="text"
                  placeholder=""
                  className="flex-1 outline-none px-2"
                />
              </div>

            </div>

            {/* Passport */}
            <div>
              <label className="text-gray-700 text-[15px]">Passport No</label>
              <input
                type="text"
                className="w-full border border-purple-300 rounded-xl mt-1 px-4 py-3 outline-none"
              />
            </div>

            {/* Country + Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-700 text-[15px]">Country</label>
                <select className="w-full border border-purple-300 rounded-xl mt-1 px-4 py-3 outline-none">
                  <option>Select</option>
                  <option>Sri Lanka</option>
                  <option>Australia</option>
                  <option>Singapore</option>
                  <option>Canada</option>
                </select>
              </div>

              <div>
                <label className="text-gray-700 text-[15px]">Gender</label>
                <select className="w-full border border-purple-300 rounded-xl mt-1 px-4 py-3 outline-none">
                  <option>Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>

            {/* Account Status */}
            <div>
              <label className="text-gray-700 text-[15px]">Account Status</label>
              <select className="w-full border border-purple-300 rounded-xl mt-1 px-4 py-3 outline-none">
                <option>Select</option>
                <option>Block</option>
                <option>Unblock</option>
              </select>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={() => navigate("/user")}
                className="px-6 py-3 rounded-xl border border-[#B749DB] text-[#B749DB] hover:bg-purple-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600"
              >
                Submit
              </button>
            </div>
          </form>
          {/* FORM END */}
        </div>
         <ToastContainer />
      </div>
    </div>
  );
}
