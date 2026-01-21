import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../../AdminSidebar";
import { useState, useEffect } from "react";
import TopBar from "../../Topbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import userService from "../../../services/user.service";
import { Loader } from "../../ui/Loader";
import { CountrySelect } from "../../ui/CountrySelect";
import { PhoneInput } from "../../ui/PhoneInput";

export default function EditCustomer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  // Determine where to redirect after success
  const redirectPath = location.state?.from || "/user";

  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passport: "",
    country: "",
    gender: "",
    dateOfBirth: "",
    isActive: true,
    newPassword: "",
    confirmPassword: "",
  });

  // ... (keep resizing useEffect)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) {
        console.error("No user ID found in URL");
        setFetchingData(false);
        return;
      }

      try {
        console.log("Fetching user data for ID:", id);
        setFetchingData(true);
        const user = await userService.getUserById(id);
        console.log("Fetched user:", user);

        // Capitalize gender to match select options
        const genderValue = (user as any).customer?.gender;
        const capitalizedGender = genderValue
          ? genderValue.charAt(0).toUpperCase() + genderValue.slice(1).toLowerCase()
          : "";

        // Map API response to form data
        setCustomerData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          passport: (user as any).customer?.passportNumber || "",
          country: (user as any).customer?.country || "",
          gender: capitalizedGender,
          dateOfBirth: (user as any).customer?.dateOfBirth ? (user as any).customer.dateOfBirth.split('T')[0] : "",
          isActive: user.status === 'active',
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        toast.error(error.response?.data?.message || "Failed to load customer data", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setFetchingData(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    // Validate passwords if provided
    if (customerData.newPassword || customerData.confirmPassword) {
      if (customerData.newPassword !== customerData.confirmPassword) {
        toast.error("Passwords do not match!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      if (customerData.newPassword.length < 6) {
        toast.error("Password must be at least 6 characters long!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
    }

    setLoading(true);
    try {
      // Prepare update data
      const updateData: any = {
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        phone: customerData.phone,
        passportNumber: customerData.passport,
        country: customerData.country,
        gender: customerData.gender,
        dateOfBirth: customerData.dateOfBirth,
        isActive: customerData.isActive,
      };

      // Add password only if provided
      if (customerData.newPassword) {
        updateData.newPassword = customerData.newPassword;
      }

      // Update user via API
      await userService.updateUser(id, updateData);

      toast.success("User updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate(redirectPath);
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update user";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
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
          <TopBar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />

          {fetchingData ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="w-16 h-16" />
            </div>
          ) : (
            <>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-[14px] md:text-[16px] font-medium mt-4 font-poppins">
                <span className="text-gray-500 cursor-pointer" onClick={() => navigate(redirectPath)}>
                  {redirectPath === '/staff' ? 'Staff' : 'Customer'}
                </span>
                <span className="text-gray-500">›</span>
                <span className="font-semibold text-black">Edit {redirectPath === '/staff' ? 'Admin' : 'Customer'}</span>
              </div>

              {/* Form Container */}
              <div className="mt-4 md:mt-6 bg-white rounded-2xl p-4 md:p-6 lg:p-8 border border-purple-100 shadow-sm">

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Loader src="/loaders/travelloading.lottie" message="Updating User Details..." size={250} />
                  </div>
                ) : (
                  <>
                    {/* Title */}
                    <div>
                      <h2 className="text-[18px] md:text-[20px] lg:text-[22px] font-semibold text-[#B749DB] font-poppins">
                        Edit {redirectPath === '/staff' ? 'Admin' : 'Customer'}
                      </h2>
                      <p className="text-gray-500 text-[12px] md:text-[14px] mt-1 font-poppins">
                        Update the details
                      </p>
                    </div>

                    {/* FORM START */}
                    <form className="mt-4 md:mt-6 space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                      {/* First Name + Last Name */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                          <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">First Name *</label>
                          <input
                            type="text"
                            value={customerData.firstName}
                            onChange={(e) => setCustomerData({ ...customerData, firstName: e.target.value })}
                            required
                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                          />
                        </div>
                        <div>
                          <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Last Name *</label>
                          <input
                            type="text"
                            value={customerData.lastName}
                            onChange={(e) => setCustomerData({ ...customerData, lastName: e.target.value })}
                            required
                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB]  rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Email Address *</label>
                        <input
                          type="email"
                          value={customerData.email}
                          onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                          required
                          disabled
                          className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins bg-gray-100"
                        />
                      </div>

                      {/* Contact */}
                      <div>
                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Contact No</label>
                        <div className="mt-1">
                          <PhoneInput
                            value={customerData.phone}
                            onChange={(value) => setCustomerData({ ...customerData, phone: value })}
                          />
                        </div>
                      </div>

                      {/* Passport */}
                      <div>
                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Passport No</label>
                        <input
                          type="text"
                          value={customerData.passport}
                          onChange={(e) => setCustomerData({ ...customerData, passport: e.target.value })}
                          className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                        />
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Date of Birth</label>
                        <input
                          type="date"
                          value={customerData.dateOfBirth}
                          onChange={(e) => setCustomerData({ ...customerData, dateOfBirth: e.target.value })}
                          className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                        />
                      </div>

                      {/* Country + Gender */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                          <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Country</label>
                          <div className="mt-1">
                            <CountrySelect
                              value={customerData.country}
                              onChange={(e) => setCustomerData({ ...customerData, country: e.target.value })}
                              className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Gender</label>
                          <select
                            value={customerData.gender}
                            onChange={(e) => setCustomerData({ ...customerData, gender: e.target.value })}
                            className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB]  rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                      </div>

                      {/* Account Status */}
                      <div>
                        <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Account Status</label>
                        <select
                          value={customerData.isActive ? "active" : "inactive"}
                          onChange={(e) => setCustomerData({ ...customerData, isActive: e.target.value === "active" })}
                          className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
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
                              value={customerData.newPassword}
                              onChange={(e) => setCustomerData({ ...customerData, newPassword: e.target.value })}
                              placeholder="Leave blank to keep current password"
                              className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                            />
                          </div>
                          <div>
                            <label className="text-gray-700 text-[13px] md:text-[14px] lg:text-[15px] font-poppins">Confirm Password</label>
                            <input
                              type="password"
                              value={customerData.confirmPassword}
                              onChange={(e) => setCustomerData({ ...customerData, confirmPassword: e.target.value })}
                              placeholder="Confirm new password"
                              className="w-full border border-purple-300 focus:ring-2 focus:ring-[#B749DB] rounded-xl mt-1 px-3 md:px-4 py-2 md:py-3 outline-none text-[14px] md:text-[16px] font-poppins"
                            />
                          </div>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex flex-row sm:flex-row justify-end gap-4 md:gap-4 mt-6">
                        <button
                          type="button"
                          onClick={() => navigate(redirectPath)}
                          className="px-8 md:px-8 py-2 md:py-3 rounded-xl border border-[#B749DB] text-[#B749DB] hover:bg-purple-50 text-[14px] md:text-[16px] font-poppins font-medium"
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          disabled={loading}
                          className="px-8 md:px-8 py-2 md:py-3 rounded-xl bg-[#B749DB] text-white hover:bg-purple-600 text-[14px] md:text-[16px] font-poppins font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center min-w-[100px]"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </>
          )}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}
