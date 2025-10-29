import { Link } from "react-router-dom";
import { IoPlayCircleOutline } from "react-icons/io5"; // For play icon
import { motion } from "framer-motion"; // Importing motion from framer-motion

// Import the background video
import heroVideo from "../assets/hero/bgvedio.mp4"; // Make sure to provide the correct video path

const HeroSection = () => {
  return (
    <motion.div
      className="relative h-screen bg-cover bg-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source src={heroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Text Content (Left Side) */}
      <div className="relative z-10 flex items-center h-full px-12 lg:px-24 text-white font-roboto-condensed">
        <div className="max-w-2xl space-y-6">
          {/* Play Icon */}
          <button className="flex items-center space-x-2 text-white hover:text-purple-400 transition">
            <IoPlayCircleOutline size={40} />
          </button>

          {/* Heading */}
          <motion.h1
            className="text-[75px] font-semibold leading-snug"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Discover the Timeless Charms of Sri Lanka
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-[30px] font-normal text-gray-200"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            Step into a world where nature and culture weave unforgettable tales.
          </motion.p>

          {/* Button */}
          <Link to="/packages">
            <motion.button
              className="bg-purple-600 font-medium text-white py-3 px-8 rounded-lg text-[16px] hover:bg-purple-700 transition"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              Explore Our Packages
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
