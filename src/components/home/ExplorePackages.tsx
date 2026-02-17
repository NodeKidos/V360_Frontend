import { motion } from "framer-motion";
import bgImage from "../../assets/bg.jpg"; // Background image
import { useState, useEffect } from "react";
import { packageService } from "../../services/package.service";
import type { Package } from "../../services/package.service";
import { useTranslation } from "react-i18next";

export default function ExplorePackages() {
  const { t } = useTranslation();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await packageService.getAll(true); // Fetch only active packages
        setPackages(data);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading) return null; // Or a skeleton
  if (packages.length === 0) return null;

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
            {t('home.explorePackages')}
          </motion.h2>

          {/* Animated Paragraph */}
          <motion.p
            className="text-[22px] font-normal text-gray-200 font-roboto-condensed leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {t('home.exploreDescription')}
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
                key={`${pkg.id}-${index}`}
                className="bg-white text-black rounded-2xl overflow-hidden shadow-xl w-[260px] h-[400px] shrink-0 hover:scale-105 transition-transform duration-300"
                whileHover={{ y: -10 }}
              >
                {pkg.image && (
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-[250px] object-cover"
                  />
                )}
                <div className="p-5">
                  <h3 className="text-[20px] font-semibold mb-2 font-roboto-condensed">
                    {pkg.title}
                  </h3>
                  <p className="text-[15px] text-gray-700 font-roboto-condensed line-clamp-3">
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
