import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuthStore } from "../../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import hero from "../../assets/travel.jpg";
import { Loader } from "../../components/ui/Loader";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { UserRole } from "../../types/auth.types";
import { CountrySelect } from "../../components/ui/CountrySelect";
import { PhoneInput } from "../../components/ui/PhoneInput";

type FormData = {
  username: string;
  email: string;
  phone: string;
  password: string;
  country: string;
  dob: string;
};

// Helper function to get dashboard route based on user role
const getDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return "/admin-dashboard";
    case UserRole.STAFF:
      return "/admin-dashboard";
    case UserRole.DRIVER:
      return "/driver-dashboard";
    case UserRole.CUSTOMER:
      return "/user-dashboard";
    default:
      return "/user-dashboard";
  }
};

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>();

  const phoneValue = watch("phone") || "";

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Validate phone number
    if (!data.phone) {
      // This will be caught by form validation
      return;
    }

    // Register endpoint creates customer account by default
    const success = await registerUser(data);

    if (success) {
      const currentUser = useAuthStore.getState().user;

      if (currentUser) {
        const dashboardRoute = getDashboardRoute(currentUser.role);
        navigate(dashboardRoute);
      } else {
        navigate("/user-dashboard");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader className="w-1/4 h-1/4" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-inter relative">
      {/* Background Image - Visible on all screen sizes */}
      <div className="w-screen h-full lg:w-1/2 absolute top-0 right-0 z-0">
        <img
          src={hero}
          alt="Travel"
          className="h-full w-full object-cover opacity-60 lg:opacity-100"
        />
      </div>

      {/* LEFT SIDE FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg space-y-4"
          >
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-albertsans font-bold text-gray-900 leading-tight">
                Create Account
              </h2>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                User Name
              </label>
              <input
                id="username"
                {...formRegister("username", { required: "Username is required" })}
                placeholder="Enter your name"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...formRegister("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                placeholder="Enter your email"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Phone Number
              </label>
              <PhoneInput
                id="phone"
                value={phoneValue}
                onChange={(value) => setValue("phone", value)}
                disabled={isLoading}
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Country Field - Using CountrySelect Component */}
            <div className="space-y-2">
              <label
                htmlFor="country"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Country
              </label>
              <CountrySelect
                id="country"
                {...formRegister("country", { required: "Country is required" })}
                disabled={isLoading}
                placeholder="Select your country"
              />
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>

            {/* Date of Birth Field */}
            <div className="space-y-2">
              <label
                htmlFor="dob"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                {...formRegister("dob", { required: "Date of birth is required" })}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                disabled={isLoading}
              />
              {errors.dob && (
                <p className="text-sm text-red-500">{errors.dob.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  {...formRegister("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Minimum 8 characters required" },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500 pr-12"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-black"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-black text-white rounded-xl py-3 text-base font-medium hover:bg-purple-600 active:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black cursor-pointer"
              disabled={isLoading}
            >
              Register
            </button>

            {/* Login Link */}
            <p className="text-center text-sm sm:text-base text-gray-600 font-poppins mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-600 font-semibold hover:text-purple-700 hover:underline transition-colors"
              >
                Login Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
