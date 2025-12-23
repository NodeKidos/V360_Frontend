import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import hero from "../../assets/sustainablityImage/nineedge.jpg";
import { Loader } from "../../components/ui/Loader";
import { useState } from "react";

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<ForgotPasswordForm> = async (data) => {
    setIsLoading(true);

    // TODO: Replace with actual API call
    setTimeout(() => {
      alert(`✅ Password reset link sent to ${data.email}`);
      navigate("/login");
      setIsLoading(false);
    }, 1500);
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
            className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg space-y-6"
          >
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-albertsans font-bold text-gray-900 leading-tight">
                Forgot Password?
              </h2>
              <p className="text-gray-600 mt-4 text-sm sm:text-base">
                Enter your email address to receive a password reset link.
              </p>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white rounded-xl py-3 text-base font-medium hover:bg-purple-600 active:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black cursor-pointer"
              disabled={isLoading}
            >
              Send Reset Link
            </button>

            {/* Back to Login Link */}
            <p className="text-center text-sm sm:text-base text-gray-600 font-poppins mt-6">
              Remembered your password?{" "}
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
