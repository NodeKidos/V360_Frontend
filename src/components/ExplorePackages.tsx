import { motion } from "framer-motion";
import bgImage from "../assets/bg.jpg"; // Background image
import soloVibes from "../assets/packages/family.png";
import familyPackage from "../assets/packages/family.png";

const packages = [
  {
    title: "Solo Vibes",
    description:
      "Perfect for solo travelers seeking peace, reflection, and adventure.",
    image: soloVibes,
  },
  {
    title: "Family Packages",
    description:
      "Create lasting memories with fun-filled activities for all ages.",
    image: familyPackage,
  },
  {
    title: "Adventure Escapes",
    description:
      "Thrilling experiences like hiking, diving, and jungle safaris await you.",
    image: familyPackage,
  },
  {
    title: "Honeymoon Getaway",
    description:
      "Romantic retreats for couples who want unforgettable experiences together.",
    image: familyPackage,
  },
  {
    title: "Cultural Discoveries",
    description:
      "Immerse yourself in Sri Lanka’s rich traditions, food, and festivals.",
    image: familyPackage,
  },
  {
    title: "Luxury Retreats",
    description:
      "Relax in the finest resorts with world-class amenities and stunning views.",
    image: familyPackage,
  },
];

export default function ExplorePackages() {
  return (
    <div
      className="relative bg-cover bg-center text-white py-24 overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-40"></div>

      {/* Main Section */}
      <div className="relative z-10 mx-auto px-16 flex flex-col md:flex-row justify-between items-center gap-16">
        {/* Left Side - Text */}
        <div className="w-full md:w-1/2">
          {/* Animated Heading */}
          <motion.h2
            className="text-[48px] font-bold text-left mb-6 font-roboto-condensed"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Explore Our Packages
          </motion.h2>

          {/* Animated Paragraph */}
          <motion.p
            className="text-[22px] font-normal text-gray-200 font-roboto-condensed leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Embark on a thrilling journey through the wilderness with activities
            like trekking, zip-lining, and wildlife safaris. These packages are
            designed for those who crave adventure, relaxation, or a spiritual
            connection with nature.
          </motion.p>
        </div>

        {/* Right Side – Animated Scrolling Packages */}
        <div className="w-full md:w-1/2 overflow-hidden relative">
          <motion.div
            className="flex gap-6"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              repeat: Infinity,
              duration: 30,
              ease: "linear",
            }}
          >
            {[...packages, ...packages].map((pkg, index) => (
              <motion.div
                key={index}
                className="bg-white text-black rounded-2xl overflow-hidden shadow-xl w-[260px] h-[400px] flex-shrink-0 hover:scale-105 transition-transform duration-300"
                whileHover={{ y: -10 }}
              >
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-[250px] object-cover"
                />
                <div className="p-5">
                  <h3 className="text-[20px] font-semibold mb-2 font-roboto-condensed">
                    {pkg.title}
                  </h3>
                  <p className="text-[15px] text-gray-700 font-roboto-condensed">
                    {pkg.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
