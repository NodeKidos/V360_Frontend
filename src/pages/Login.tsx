import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore"; // ← no '@' alias

import { Link } from "react-router-dom";
import hero from "../assets/travel.jpg"; // ✅ Correct import

interface LoginForm {
  emailOrPhone: string;
  password: string;
}

export default function Login() {
  const { login } = useAuthStore();
  const { register, handleSubmit } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    login(data.emailOrPhone, data.password);
    alert("✅ Login successful!");
  };

  return (
    <div className="flex h-screen font-poppins">
      {/* LEFT SIDE FORM */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[500px] bg-white p-8 rounded-2xl shadow-md"
        >
          {/* Heading */}
          <h2 className="text-[40px] font-albertsans font-bold mb-8 text-center text-gray-900 leading-tight">
            Enjoy your Trip! <br /> Please Login
          </h2>

          {/* Email/Phone Field */}
          <label className="block text-[16px] font-poppins font-medium text-gray-800 mb-2">
            Email/Phone Number
          </label>
          <input
            {...register("emailOrPhone")}
            placeholder="Enter your email/phone number"
            className="w-full border rounded-md p-3 text-[16px] mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Password Field */}
          <label className="block text-[16px] font-poppins font-medium text-gray-800 mb-2">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            placeholder="Enter Password"
            className="w-full border rounded-md p-3 text-[16px] mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Options */}
          <div className="flex justify-between items-center text-sm mb-4">
            <label className="flex items-center gap-2 text-gray-700">
              <input type="checkbox" /> Stay Logged in
            </label>
            <Link
              to="/forgot-password"
              className="text-gray-500 hover:text-purple-600 transition"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-[200px] mx-auto block bg-black text-white rounded-[15px] p-3 text-[18px] font-poppins font-medium hover:bg-purple-600 transition"
          >
            Login
          </button>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-gray-300" />
            <p className="px-3 text-gray-500 font-poppins">OR</p>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* OTP Button */}
          <Link
            to="/otp"
            className="block w-[200px] mx-auto text-center border border-black rounded-[15px] p-3 text-[18px] font-poppins hover:bg-black hover:text-white transition"
          >
            Login with OTP
          </Link>

          {/* Register Link */}
          <p className="text-center mt-6 text-sm text-gray-700 font-poppins">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-purple-600 font-semibold hover:underline"
            >
              Register Here
            </Link>
          </p>
        </form>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="w-1/2">
        <img
          src={hero}
          alt="Travel"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
