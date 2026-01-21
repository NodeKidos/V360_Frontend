import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../AdminSidebar";
import { useState, useEffect } from "react";
import TopBar from "../../Topbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import staffService from "../../../services/staff.service";
import { Loader } from "../../ui/Loader";
import { PhoneInput } from "../../ui/PhoneInput";

export default function EditStaff() {
  const navigate = useNavigate();
  const { staffId } = useParams(); // Get staff id from the URL params
  const id = staffId; // Use staffId from route params
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [staffData, setStaffData] = useState({
    name: "",
    email: "",
    countryCode: "🇱🇰 +94",
    contact: "",
    accessLevel: "" as "Staff" | "Admin" | "Manager" | "",
    gender: "" as "Male" | "Female" | "",
    status: "" as "active" | "inactive" | "",
    nic: "",
    age: "",
    newPassword: "",
    confirmPassword: "",
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
    const fetchStaffData = async () => {
      if (!id) {
        console.log("No staff ID provided");
        setFetchLoading(false);
        return;
      }

      console.log("Fetching staff data for ID:", id);
      setFetchLoading(true);
      try {
        const staff = await staffService.getStaffById(id);
        console.log("Staff data received:", staff);
        setStaffData({
          name: staff.name,
          email: staff.email,
          countryCode: "🇱🇰 +94", // Default value
          contact: staff.contact,
          accessLevel: staff.accessLevel,
          gender: staff.gender,
          status: staff.status?.toLowerCase() as "active" | "inactive",
          nic: staff.nic,
          age: typeof staff.age === 'number' ? staff.age.toString() : staff.age || '',
          newPassword: "",
          confirmPassword: "",
        });
        console.log("Staff data set successfully");
      } catch (error: any) {
        console.error("Failed to fetch staff data:", error);
        toast.error(error.response?.data?.message || "Failed to load staff data", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        console.log("Setting fetchLoading to false");
        setFetchLoading(false);
      }
    };

    fetchStaffData();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStaffData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    // Validation
    if (!staffData.name || !staffData.email || !staffData.contact || !staffData.nic ||
      !staffData.gender || !staffData.age || !staffData.accessLevel || !staffData.status) {
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Validate passwords if provided
    if (staffData.newPassword || staffData.confirmPassword) {
      if (staffData.newPassword !== staffData.confirmPassword) {
        toast.error("Passwords do not match!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      if (staffData.newPassword.length < 6) {
        toast.error("Password must be at least 6 characters long!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    }

    setLoading(true);
    try {
      const updateData: any = {
        name: staffData.name,
        email: staffData.email,
        contact: staffData.contact,
        nic: staffData.nic,
        gender: staffData.gender as "Male" | "Female",
        age: parseInt(staffData.age),
        accessLevel: staffData.accessLevel as "Staff" | "Admin" | "Manager",
        status: staffData.status as "active" | "inactive",
      };

      // Add password only if provided
      if (staffData.newPassword) {
        updateData.password = staffData.newPassword;
      }

      await staffService.updateStaff(id, updateData);

      toast.success("Staff details updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/staff");
      }, 2000);
    } catch (error: any) {
      // Handle specific error messages
      let errorMessage = "Failed to update staff";

      // Check error response status
      if (error.response?.status === 500) {
        // Internal server error - likely a duplicate email since validation passed
        const errorData = error.response?.data || {};
        const errorString = JSON.stringify(errorData).toLowerCase();

        // Check if it's a duplicate/unique constraint error
        if (errorString.includes('duplicate') ||
          errorString.includes('already exists') ||
          errorString.includes('unique constraint') ||
          errorString.includes('uq_') ||
          errorString.includes('23505')) {
          errorMessage = "This email address is already registered. Please use a different email.";
        } else if (errorString.includes('internal server error')) {
          // Backend returns generic 500 error for duplicate emails
          errorMessage = "This email address is already registered. Please use a different email.";
        } else {
          errorMessage = "An error occurred on the server. Please try again or contact support.";
        }
      } else if (error.response?.status === 409) {
        errorMessage = "This email address is already registered. Please use a different email.";
      } else if (error.response?.data?.message) {
        const message = error.response.data.message;
        if (Array.isArray(message)) {
          errorMessage = message.join(", ");
        } else if (typeof message === 'string') {
          // Check for common error patterns
          if (message.toLowerCase().includes('duplicate') ||
            message.toLowerCase().includes('already exists') ||
            message.toLowerCase().includes('unique constraint')) {
            errorMessage = "This email address is already registered. Please use a different email.";
          } else {
            errorMessage = message;
          }
        }
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
      setLoading(false); // Only turn off loading on error, keep it on for success/redirect
    }
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

          {fetchLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="w-16 h-16" />
            </div>
          ) : (
            <>
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

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Loader src="/loaders/travelloading.lottie" message="Updating Staff Details..." size={250} />
                  </div>
                ) : (
                  <>
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
                      {/* Rest of the form inputs remain the same */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

                        {/* Staff Name */}
                        <div>
                          <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Staff Name</label>
                          <input
                            type="text"
                            name="name"
                            value={staffData.name}
                            onChange={handleInputChange}
                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
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
                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                          />
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                          <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Contact No</label>
                          <div className="mt-1">
                            <PhoneInput
                              value={staffData.contact}
                              onChange={(value) => setStaffData(prev => ({ ...prev, contact: value }))}
                            />
                          </div>
                        </div>

                        {/* Access Level*/}
                        <div>
                          <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Access Level</label>
                          <select
                            name="accessLevel"
                            value={staffData.accessLevel}
                            onChange={handleInputChange}
                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                          >
                            <option value="">Select</option>
                            <option value="Staff">Staff</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
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
                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                          />
                        </div>

                        <div>
                          <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Gender</label>
                          <select
                            name="gender"
                            value={staffData.gender}
                            onChange={handleInputChange}
                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
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
                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                          >
                            <option value="">Select</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">NIC</label>
                          <input
                            type="text"
                            name="nic"
                            value={staffData.nic}
                            onChange={handleInputChange}
                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                          />
                        </div>
                      </div>

                      {/* Password Section */}
                      <div className="border-t border-purple-200 pt-4 md:pt-6">
                        <h3 className="text-[16px] md:text-[18px] font-semibold text-gray-800 mb-4 font-poppins">
                          Change Password (Optional)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div>
                            <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">New Password</label>
                            <input
                              type="password"
                              name="newPassword"
                              value={staffData.newPassword}
                              onChange={handleInputChange}
                              placeholder="Leave blank to keep current password"
                              className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                            />
                          </div>
                          <div>
                            <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Confirm Password</label>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={staffData.confirmPassword}
                              onChange={handleInputChange}
                              placeholder="Confirm new password"
                              className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                            />
                          </div>
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
                          disabled={loading || fetchLoading}
                          className="px-6 md:px-8 py-2 md:py-3 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600 text-[14px] md:text-[16px] font-poppins font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center min-w-[100px]"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </>
                )}
                {/* FORM END */}
              </div>
            </>
          )}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}
