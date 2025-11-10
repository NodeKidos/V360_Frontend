import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Card, CardContent } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import hero from "../assets/waterfall.jpg"; // ✅ background image

interface FormData {
  email?: string;
  phone?: string;
}

export default function OtpVerification() {
  const [mode, setMode] = useState<"email" | "phone">("email");
  const navigate = useNavigate();
  const generateOtp = useAuthStore((s) => s.generateOtp);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const target = mode === "email" ? data.email! : data.phone!;
    const otp = generateOtp(mode, target);
    alert(`📩 OTP sent to your ${mode}: ${otp}`);
    navigate("/verify-otp");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white relative">
      {/* LEFT SIDE IMAGE (Visible on mobile/tablet, hidden on desktop) */}
      <div className="w-screen h-full lg:w-1/2 absolute top-0 right-0 z-0">
        <img
          src={hero}
          alt="Travel"
          className="h-full w-full object-cover opacity-60 lg:opacity-100" // Apply opacity consistently across mobile and tablet
        />
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="flex items-center justify-center p-5 sm:p-8 lg:p-10 z-10 relative">
        <Card className="w-full max-w-[500px] rounded-3xl shadow-md border border-gray-200 bg-white">
          <CardContent className="p-8 sm:p-10">
            <h1 className="text-[24px] sm:text-[30px] lg:text-[40px] font-albertsans font-extrabold text-center text-gray-900 mb-3">
              OTP Verification
            </h1>
            <p className="text-gray-500 mb-6 font-inter text-[16px] sm:text-[18px] lg:text-[20px] leading-relaxed">
              {mode === "email"
                ? "Enter email verification code we just sent to your email xxxxxx@gmail.com"
                : "Enter the verification code we just sent to your Phone No xxxxxxxxxx"}
            </p>

            {/* Tabs for Email / Phone selection */}
            <Tabs
              value={mode}
              onValueChange={(v) => setMode(v as "email" | "phone")}
              className="w-full mb-6 font-poppins text-[20px] md:text-[24px] lg:text-[28px] "
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-200 rounded-md">
                <TabsTrigger
                  value="email"
                  className="py-2 font-semibold rounded-l-md transition-all data-[state=active]:bg-[#B749DB] data-[state=active]:text-white data-[state=inactive]:text-black"
                >
                  Email
                </TabsTrigger>

                <TabsTrigger
                  value="phone"
                  className="py-2 font-semibold rounded-r-md transition-all data-[state=active]:bg-[#B749DB] data-[state=active]:text-white data-[state=inactive]:text-black"
                >
                  Phone No
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 text-left"
            >
              {mode === "email" ? (
                <div>
                  <Label className="font-semibold font-poppins text-[16px] sm:text-[18px] lg:text-[20px] text-gray-900">
                    Email
                  </Label>
                  <Input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    placeholder="Enter your email"
                    className="mt-1 p-3 text-[16px] placeholder-gray-400"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>
              ) : (
                <div>
                  <Label className="font-semibold font-poppins text-[16px] sm:text-[18px] lg:text-[20px] text-gray-900">
                    Phone No
                  </Label>
                  <Input
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                    })}
                    placeholder="Enter your Phone No"
                    className="mt-1 p-3 text-[16px] placeholder-gray-400"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>
              )}

              {/* Send OTP Button */}
              <div className="text-center pt-2">
                <Button
                  type="submit"
                  variant="outline"
                  className="px-6 py-2 w-35 border font-poppins font-medium text-[16px] border-black text-black rounded-md hover:bg-black hover:text-white transition-all"
                >
                  Send OTP
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
