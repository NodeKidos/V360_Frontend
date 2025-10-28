import { Link } from 'react-router-dom';
import { IoPlayCircleOutline } from 'react-icons/io5'; // For play icon
import heroImage from '../assets/travel.jpg';

const HeroSection = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Text Content (Left Side) */}
      <div className="relative z-10 flex items-center h-full px-12 lg:px-24 text-white font-roboto-condensed">
        <div className="max-w-2xl space-y-6">
          {/* Play Icon */}
          <button className="flex items-center space-x-2 text-white hover:text-purple-400 transition">
            <IoPlayCircleOutline size={40} />
          </button>

          {/* Heading */}
          <h1 className="text-[55px] font-semibold leading-snug">
            Discover the Timeless Charms of Sri Lanka
          </h1>

          {/* Subtext */}
          <p className="text-[20px] font-normal text-gray-200">
            Step into a world where nature and culture weave unforgettable tales
          </p>

          {/* Button */}
          <Link to="/packages">
            <button className="bg-purple-600 font-medium text-white py-3 px-8 rounded-lg text-[16px] hover:bg-purple-700 transition">
              Explore Our Packages
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
