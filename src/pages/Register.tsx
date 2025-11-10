import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore"; 
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import hero from "../assets/travel.jpg"; 

type FormData = {
  username: string;
  email: string;
  phone: string;
  password: string;
  country: string;
};

export default function Register() {
  const registerUser = useAuthStore((s) => s.register);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    registerUser(data);
    alert("✅ Registered successfully!");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white relative">
      {/* LEFT IMAGE (Visible on mobile/tablet, overlapping the form) */}
      <div className="w-screen h-full lg:w-1/2 absolute top-0 right-0 z-0">
        <img
          src={hero}
          alt="Travel"
          className="h-full w-full object-cover opacity-80 lg:opacity-100" // Apply opacity consistently across mobile and tablet
        />
      </div>

      {/* RIGHT FORM */}
      <div className="flex items-center justify-center p-5 sm:p-8 lg:p-10 z-10 relative">
        <Card className="w-full max-w-[500px] rounded-[28px] shadow-lg border border-black/5 bg-white">
          <CardContent className="p-8">
            <h1 className="text-[30px] md:text-[40px] lg:text-[50px] font-albertsans font-semibold mt-4 text-center text-gray-900 leading-tight">
              Create an Account
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-poppins p-5 sm:p-8 lg:p-10">
              <div>
                <Label className="text-[20px] sm:text-[24px] lg:text-[28px] font-medium text-gray-800">User Name</Label>
                <Input
                  {...formRegister("username", { required: "Required" })}
                  placeholder="Enter name"
                  className="w-full border rounded-md p-3 text-[16px] placeholder-gray-400"
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>

              <div>
                <Label className="text-[20px] sm:text-[24px] lg:text-[28px] font-medium text-gray-800">Email</Label>
                <Input
                  type="email"
                  {...formRegister("email", {
                    required: "Required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email",
                    },
                  })}
                  placeholder="Enter email"
                  className="w-full border rounded-md p-3 text-[16px] placeholder-gray-400"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label className="text-[20px] sm:text-[24px] lg:text-[28px] font-medium text-gray-800">Phone</Label>
                <Input
                  {...formRegister("phone", { required: "Required" })}
                  placeholder="Enter phone"
                  className="w-full border rounded-md p-3 text-[16px] placeholder-gray-400"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label className="text-[20px] sm:text-[24px] lg:text-[28px] font-medium text-gray-800">Country</Label>
                <Input
                  {...formRegister("country", { required: "Required" })}
                  placeholder="Enter country"
                  className="w-full border rounded-md p-3 text-[16px] placeholder-gray-400"
                />
                {errors.country && (
                  <p className="text-sm text-red-500">{errors.country.message}</p>
                )}
              </div>

              <div>
                <Label className="text-[20px] sm:text-[24px] lg:text-[28px] font-medium text-gray-800">Password</Label>
                <Input
                  type="password"
                  {...formRegister("password", {
                    required: "Required",
                    minLength: { value: 8, message: "Min 8 chars" },
                  })}
                  placeholder="Enter password"
                  className="w-full border rounded-md p-3 text-[16px] placeholder-gray-400"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Submit button */}
              <Button type="submit" className="w-[180px] h-[50px] mx-auto block mt-4 rounded-[15px] text-[16px] md:text-[20px] lg:text-[20px]">
                Register
              </Button>

              <p className="text-center text-[16px] md:text-[20px] lg:text-[20px] text-gray-700 font-poppins">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-purple-600 hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
