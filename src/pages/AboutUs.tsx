import { motion } from "framer-motion";
import aboutImg from "../assets/bg.jpg"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutUs() {
  // Animation variants for reuse
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const zoomIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const staggerCards = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardItem = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* ✅ Navbar at the very top */}
      <Navbar />

      {/* ✅ Page Content */}
      <div className="py-20 px-8 md:px-20">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Text Section */}
          <motion.div
            className="md:w-1/2"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h1 className="text-[48px] font-bold mb-4 font-roboto-condensed">
              About <span className="text-[#B749DB]">Vibes Lanka</span>
            </h1>
            <p className="text-gray-700 text-[20px] leading-relaxed font-roboto-condensed mb-6">
              Vibes Lanka Travel and Tours is a premier travel agency dedicated
              to showcasing the beauty, culture, and adventure of Sri Lanka. Our
              mission is to craft personalized experiences for every traveler —
              whether you're exploring nature, seeking luxury, or discovering
              local traditions.
            </p>
            <p className="text-gray-600 text-[18px] font-roboto-condensed">
              With years of experience, we pride ourselves on delivering reliable
              and affordable packages designed for solo travelers, families,
              honeymooners, and adventure seekers. From the golden beaches of
              Galle to the misty hills of Kandy — your perfect Sri Lankan getaway
              starts here.
            </p>
          </motion.div>

          {/* Right Image Section */}
          <motion.div
            className="md:w-1/2"
            variants={zoomIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <img
              src={aboutImg}
              alt="About Vibes Lanka"
              className="rounded-2xl shadow-xl w-full object-cover h-[450px]"
            />
          </motion.div>
        </div>

        {/* Mission / Vision Section */}
        <motion.div
          className="mt-20 text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-[38px] font-semibold mb-6 font-roboto-condensed">
            Our Mission & Vision
          </h2>
          <p className="max-w-4xl mx-auto text-gray-700 text-[20px] leading-relaxed font-roboto-condensed">
            We aim to redefine travel by creating authentic, sustainable, and
            unforgettable experiences across Sri Lanka. Our vision is to make
            every journey meaningful — connecting people with the island’s vibrant
            culture, breathtaking landscapes, and warm hospitality.
          </p>
        </motion.div>

        {/* Stats / Highlights Section with stagger animation */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-20 text-center"
          variants={staggerCards}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { num: "10+", label: "Years of Experience" },
            { num: "500+", label: "Happy Clients" },
            { num: "100+", label: "Tour Packages" },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={cardItem}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-[#B749DB] text-white rounded-2xl py-10 shadow-md cursor-default"
            >
              <h3 className="text-[48px] font-bold mb-2">{item.num}</h3>
              <p className="text-[18px]">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ✅ Footer at the bottom */}
      <Footer />
    </div>
  );
}
