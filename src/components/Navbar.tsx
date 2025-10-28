import { Link } from "react-router-dom";
import { IoMdInformationCircleOutline } from "react-icons/io"; // Info Icon
import { TbWorld } from "react-icons/tb"; // Globe Icon
import logo from "../assets/favicon.png"; // logo image

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4 px-8 flex items-center justify-between">
      {/* Left side logo */}
      <div className="flex items-center space-x-4">
        <img src={logo} alt="Vibes Lanka" className="w-20" />
      </div>

      {/* Right side (Nav Links + Login + Language + Info) */}
      <div className="flex items-center space-x-6 font-roboto-condensed font-medium">
        {/* Navigation Links */}
        <ul className="flex space-x-6 text-lg">
          <li>
            <Link to="/home" className="text-gray-700 hover:text-purple-600">
              Home
            </Link>
          </li>
          <li>
            <Link to="/itinerary" className="text-gray-700 hover:text-purple-600">
              Itinerary
            </Link>
          </li>
          <li>
            <Link to="/about-us" className="text-gray-700 hover:text-purple-600">
              About Us
            </Link>
          </li>
        </ul>

        {/* Login Button */}
        <Link
          to="/login"
          className="text-lg font-semibold text-white bg-[#B749DB] py-2 px-6 rounded-md hover:bg-purple-700 transition"
        >
          Login
        </Link>

        {/* Currency */}
        <span className="text-lg font-bold text-gray-700">LKR</span>

        {/* Icons */}
        <div className="flex items-center space-x-3">
          {/* Language Icon */}
          <button className="text-gray-700 hover:text-purple-600">
            <TbWorld size={22} />
          </button>
          {/* Info Icon */}
          <button className="text-gray-700 hover:text-purple-600">
            <IoMdInformationCircleOutline size={22} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
