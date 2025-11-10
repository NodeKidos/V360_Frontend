import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import hero from "../assets/sustainablityImage/nineedge.jpg"; // Add your background image here

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>();
  const navigate = useNavigate();

  // Simulating an API call to send reset link
  const onSubmit: SubmitHandler<ForgotPasswordForm> = (data) => {
    // Call your API to send the reset password link to the email
    alert(`✅ Password reset link sent to ${data.email}`);
    navigate("/login");  // Redirecting to the login page after sending the email
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* LEFT SIDE IMAGE */}
      <div className="w-screen h-full lg:w-1/2 absolute top-0 right-0 z-0">
        <img
          src={hero}
          alt="natural"
          className="h-full w-full object-cover opacity-60 lg:opacity-100" // Apply opacity consistently across mobile and tablet
        />
      </div>

      {/* RIGHT FORM */}
      <div className="flex items-center justify-center p-6 lg:p-10 z-10 relative">
        <Card className="w-full  max-w-[600px] rounded-[28px] shadow-lg border border-gray-200 bg-white">
          <CardContent className="p-8">
            <h1 className="text-[30px] md:text-[40px] lg:text-[50px] font-extrabold text-gray-900 mb-6 text-center">
              Forgot Password
            </h1>
            <p className="text-gray-500 mb-6 text-[16px] md:text-[24px] lg:text-[28px] sm:text-base leading-relaxed text-center">
              Enter your email address to receive a password reset link.
            </p>

            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-inter">
              <div>
                <Label className="text-[16px] md:text-[24px] lg:text-[28px] font-medium">Email</Label>
                <Input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email",
                    },
                  })}
                  placeholder="Enter your email"
                  className="w-full p-3 text-[16px] border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-60 lg:w-[300px] h-15 mx-auto block mt-4 rounded-[15px] bg-black text-white p-3 text-[18px] font-inter font-medium hover:bg-purple-600 transition"
              >
                Send Reset Link
              </Button>

              {/* Link to Login */}
              <p className="text-center mt-4 text-[14px] md:text-[20px] lg:text-[24px]">
                Remembered your password?{" "}
                <Link to="/login" className="text-purple-600 font-semibold hover:underline">
                  Login Here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
