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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* LEFT SIDE IMAGE */}
      <div className="hidden lg:block relative">
        <img
          src={hero}
          alt="Waterfall"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="flex items-center justify-center p-8">
        <Card className="w-[500px] h-[450px]  bg-white rounded-[24px] shadow-md border border-gray-200">
          <CardContent className="p-8 sm:p-10 text-center">
            <h1 className="text-[40px]  font-albertsans font-extrabold text-gray-900 mb-3">
              OTP Verification
            </h1>
            <p className="text-gray-500 mb-6 font-poppins  text-[30px] sm:text-base leading-relaxed">
              {mode === "email"
                ? "Enter email verification code we just send to your email xxxxxx@gmail.com"
                : "Enter email verification code we just send to your Phone No xxxxxxxxxx"}
            </p>

            {/* Tabs for Email / Phone selection */}
            <Tabs
              value={mode}
              onValueChange={(v) => setMode(v as "email" | "phone")}
              className="w-full mb-6 font-poppins text-[32px]"
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-200 rounded-md">
                <TabsTrigger
                  value="email"
                  className="py-2 font-semibold rounded-l-md transition-all 
                 data-[state=active]:bg-[#B749DB] 
                 data-[state=active]:text-white 
                 data-[state=inactive]:text-black"
                >
                  Email
                </TabsTrigger>

                <TabsTrigger
                  value="phone"
                  className="py-2  font-semibold rounded-r-md transition-all 
                 data-[state=active]:bg-[#B749DB] 
                 data-[state=active]:text-white 
                 data-[state=inactive]:text-black"
                >
                  Phone No
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 text-left "
            >
              {mode === "email" ? (
                <div>
                  <Label className="font-semibold font-poppins text-[20px] text-gray-900">Email</Label>
                  <Input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    placeholder="Enter your email"
                    className="mt-1"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <Label className="font-semibold font-poppins text-[20px] text-gray-900">Phone No</Label>
                  <Input
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                    })}
                    placeholder="Enter your Phone No"
                    className="mt-1"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.phone.message}
                    </p>
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
