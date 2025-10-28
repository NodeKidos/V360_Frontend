import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore"; // ← no '@' alias
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import hero from "../assets/travel.jpg"; // ✅ Correct import

type FormData = {
  username: string;
  email: string;
  phone: string;
  password: string;
  country: string;
};

export default function Register() {
  const registerUser = useAuthStore((s) => s.register);

  // rename RHF's register to avoid confusion
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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* LEFT image */}
      <div className="hidden lg:block relative">
        <img src={hero} alt="Travel" className="absolute inset-0 h-full w-full object-cover" />
      </div>

      {/* RIGHT form */}
      <div className="flex items-center justify-center p-8">
        <Card className="w-[600px]  rounded-[28px] shadow-lg border border-black/5">
          <CardContent className="p-8"> {/* Added padding for the form */}
            <h1 className="text-4xl font-albertsans font-extrabold text-center text-gray-900 mb-6">
              Create an Account
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-poppins p-10">
              <div>
                <Label className="text-[16px] font-poppins font-medium">User Name</Label>
                <Input
                  {...formRegister("username", { required: "Required" })}
                  placeholder="Enter name"
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>

              <div>
                <Label className="text-[16px] font-poppins font-medium">Email</Label>
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
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label className="text-[16px] font-poppins font-medium">Phone</Label>
                <Input
                  {...formRegister("phone", { required: "Required" })}
                  placeholder="Enter phone"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label className="text-[16px] font-poppins font-medium">Country</Label>
                <Input
                  {...formRegister("country", { required: "Required" })}
                  placeholder="Enter country"
                />
                {errors.country && (
                  <p className="text-sm text-red-500">{errors.country.message}</p>
                )}
              </div>

              <div>
                <Label className="text-[16px] font-poppins font-medium">Password</Label>
                <Input
                  type="password"
                  {...formRegister("password", {
                    required: "Required",
                    minLength: { value: 8, message: "Min 8 chars" },
                  })}
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Submit button with reduced width */}
              <Button type="submit" className="w-[180px] mx-auto block mt-4 rounded-[15px]">
                Register
              </Button>

              <p className="text-center text-sm">
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
