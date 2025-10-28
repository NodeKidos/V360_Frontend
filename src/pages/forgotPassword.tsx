import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen flex justify-center items-center bg-white">
      <Card className="w-full max-w-sm rounded-[28px] shadow-lg border border-black/5">
        <CardContent className="p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Forgot Password</h1>
          <p className="text-gray-500 mb-6 text-sm sm:text-base leading-relaxed">
            Enter your email address to receive a password reset link.
          </p>

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-poppins">
            <div>
              <Label className="text-[16px] font-poppins font-medium">Email</Label>
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
                className="w-full p-3 text-[16px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-4 rounded-[15px] bg-black text-white p-3 text-[18px] font-poppins font-medium hover:bg-purple-600 transition"
            >
              Send Reset Link
            </Button>

            {/* Link to Login */}
            <p className="text-center mt-4 text-sm">
              Remembered your password?{" "}
              <Link to="/login" className="text-purple-600 font-semibold hover:underline">
                Login Here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
