import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { UserRole } from "../../types/auth.types";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import hero from "../../assets/waterfall.jpg";

interface FormData {
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
}

// Helper function to get dashboard route based on user role
const getDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return "/admin-dashboard";
    case UserRole.STAFF:
      return "/admin-dashboard"; // Staff also goes to admin dashboard
    case UserRole.DRIVER:
      return "/driver-dashboard"; // You'll need to create this
    case UserRole.CUSTOMER:
      return "/user-dashboard"; // Customers go to user dashboard
    default:
      return "/user-dashboard";
  }
};

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { verifyOtp, resendOtp, otpMode, otpTarget, isLoading } = useAuthStore();

  const { register, handleSubmit, setFocus } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const otpCode = data.otp1 + data.otp2 + data.otp3 + data.otp4;
    const success = await verifyOtp(otpCode);

    if (success) {
      // Get the updated user from the store
      const currentUser = useAuthStore.getState().user;

      if (currentUser) {
        // Route based on user role
        const dashboardRoute = getDashboardRoute(currentUser.role);
        navigate(dashboardRoute);
      } else {
        // Fallback to user dashboard if no user data
        navigate("/user-dashboard");
      }
    }
  };

  const handleResendOtp = async () => {
    await resendOtp();
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white relative">
      {/* LEFT SIDE IMAGE */}
      <div className="w-screen h-full lg:w-1/2 absolute top-0 right-0 z-0">
        <img
          src={hero}
          alt="Travel"
          className="h-full w-full object-cover opacity-60 lg:opacity-100"
        />
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="flex items-center justify-center p-5 sm:p-8 lg:p-10 z-10 relative">
        <Card className="w-full max-w-xl rounded-3xl shadow-md border border-gray-200 bg-white">
          <CardContent className="p-8 sm:p-10 text-center">
            <h1 className="text-[24px] sm:text-[30px] lg:text-[40px] font-albertsans font-extrabold text-gray-900 mb-3">
              {otpMode === "email" ? "Email" : "Phone"} OTP Verification
            </h1>
            <p className="text-gray-500 mb-6 font-inter text-[18px] sm:text-[20px] lg:text-[22px] leading-relaxed">
              Enter {otpMode} verification code we just sent to{" "}
              <span className="font-semibold text-gray-700">{otpTarget}</span>
            </p>

            {/* OTP Input Fields */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
              <div className="flex justify-center gap-4 sm:gap-5">
                {/* OTP input boxes */}
                <input
                  {...register("otp1")}
                  maxLength={1}
                  onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')}
                  onChange={() => setFocus("otp2")}
                  className="w-14 h-14 sm:w-16 sm:h-16 border border-gray-300 text-center text-xl sm:text-2xl rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  disabled={isLoading}
                />
                <input
                  {...register("otp2")}
                  maxLength={1}
                  onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')}
                  onChange={() => setFocus("otp3")}
                  className="w-14 h-14 sm:w-16 sm:h-16 border border-gray-300 text-center text-xl sm:text-2xl rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  disabled={isLoading}
                />
                <input
                  {...register("otp3")}
                  maxLength={1}
                  onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')}
                  onChange={() => setFocus("otp4")}
                  className="w-14 h-14 sm:w-16 sm:h-16 border border-gray-300 text-center text-xl sm:text-2xl rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  disabled={isLoading}
                />
                <input
                  {...register("otp4")}
                  maxLength={1}
                  onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')}
                  className="w-14 h-14 sm:w-16 sm:h-16 border border-gray-300 text-center text-xl sm:text-2xl rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  disabled={isLoading}
                />
              </div>

              {/* Resend link */}
              <p className="text-gray-500 text-[16px] sm:text-[20px] lg:text-[24px] leading-relaxed text-center">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  className="text-purple-600 font-medium hover:underline disabled:opacity-50"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                >
                  Resend
                </button>
              </p>

              {/* Verify Button */}
              <Button
                type="submit"
                className="w-full mt-4 h-12 sm:h-14 bg-gray-400 hover:bg-black hover:text-white transition-all text-[16px] sm:text-[20px] lg:text-[24px]"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
