import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import hero from "../assets/waterfall.jpg";

interface FormData {
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
}

export default function VerifyOtp() {
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const otpMode = useAuthStore((s) => s.otpMode);
  const otpTarget = useAuthStore((s) => s.otpTarget);

  const { register, handleSubmit, setFocus } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    const otpCode = data.otp1 + data.otp2 + data.otp3 + data.otp4;
    const ok = verifyOtp(otpCode);
    if (ok) {
      alert("✅ OTP Verified Successfully!");
    } else {
      alert("❌ Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* LEFT image */}
      <div className="hidden lg:block relative">
        <img
          src={hero}
          alt="Travel"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* RIGHT form */}
      <div className="flex items-center justify-center p-6 lg:p-10">
        <Card className="w-full max-w-xl h-[500px] rounded-[28px] shadow-md border border-gray-200">
          <CardContent className="p-8 sm:p-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-albertsans font-extrabold text-gray-900 mb-3">
              {otpMode === "email" ? "Email" : "Phone"} OTP Verification
            </h1>
            <p className="text-gray-500 mb-8 font-poppins text-[36px] font-medium sm:text-base">
              Enter {otpMode} verification code we just sent to {" "}
              <span className="font-semibold text-gray-700">{otpTarget}</span>
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-15 font-poppins"
            >
              {/* OTP boxes */}
              <div className="flex justify-center gap-3 sm:gap-5">
                <input
                  {...register("otp1")}
                  maxLength={1}
                  onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')}
                  onChange={() => setFocus("otp2")}
                  className="w-12 h-12 sm:w-14 sm:h-14 border border-gray-300 text-center text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  {...register("otp2")}
                  maxLength={1}
                  onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')}
                  onChange={() => setFocus("otp3")}
                  className="w-12 h-12 sm:w-14 sm:h-14 border border-gray-300 text-center text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  {...register("otp3")}
                  maxLength={1}
                  onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')}
                  onChange={() => setFocus("otp4")}
                  className="w-12 h-12 sm:w-14 sm:h-14 border border-gray-300 text-center text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  {...register("otp4")}
                  maxLength={1}
                  onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '')}
                  className="w-12 h-12 sm:w-14 sm:h-14 border border-gray-300 text-center text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Resend link */}
              <p className="text-gray-500 text-sm sm:text-base">
                Didn’t receive code?{" "}
                <button
                  type="button"
                  className="text-purple-600 font-medium hover:underline"
                  onClick={() => alert("📩 OTP resent!")}
                >
                  Resend
                </button>
              </p>

              {/* Verify button */}
              <Button
                type="submit"
                className="w-full mt-4 h-11 sm:h-12 bg-gray-300 hover:bg-black hover:text-white transition-all"
              >
                Verify
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
