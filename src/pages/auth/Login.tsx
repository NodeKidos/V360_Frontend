import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { UserRole } from "../../types/auth.types";
import hero from "../../assets/travel.jpg";

interface LoginForm {
  emailOrPhone: string;
  password: string;
}

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
      return "/home";
  }
};

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    const success = await login(data.emailOrPhone, data.password);

    if (success) {
      const currentUser = useAuthStore.getState().user;

      if (currentUser) {
        const dashboardRoute = getDashboardRoute(currentUser.role);
        navigate(dashboardRoute);
      } else {
        navigate("/home");
      }
    }
  };

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
            className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg space-y-6"
          >
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-albertsans font-bold text-gray-900 leading-tight">
                Enjoy your Trip!
                <br />
                Please Login
              </h2>
            </div>

            {/* Email/Phone Field */}
            <div className="space-y-2">
              <label
                htmlFor="emailOrPhone"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Email/Phone Number
              </label>
              <input
                id="emailOrPhone"
                {...register("emailOrPhone", { required: "Email or phone is required" })}
                placeholder="Enter your email or phone number"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                disabled={isLoading}
              />
              {errors.emailOrPhone && (
                <p className="text-sm text-red-500">{errors.emailOrPhone.message}</p>
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
              <input
                id="password"
                {...register("password", { required: "Password is required" })}
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Options */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span>Stay Logged in</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-black text-white rounded-xl py-3 text-base font-medium hover:bg-purple-600 active:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-300" />
              <p className="px-4 text-sm text-gray-500 font-poppins">OR</p>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* OTP Button */}
            <Link
              to="/otp"
              className="block w-full text-center border-2 border-black text-black rounded-xl py-3 text-base font-poppins font-medium hover:bg-black hover:text-white transition-colors"
            >
              Login with OTP
            </Link>

            {/* Register Link */}
            <p className="text-center text-sm sm:text-base text-gray-600 font-poppins mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-purple-600 font-semibold hover:text-purple-700 hover:underline transition-colors"
              >
                Register Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
