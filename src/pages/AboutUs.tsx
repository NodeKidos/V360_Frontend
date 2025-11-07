import { motion } from "framer-motion";
import { FaArrowRight, FaGlobe, FaHeart, FaStarOfLife, FaCoins, FaPlane } from "react-icons/fa";
import hero from "../assets/Swing.jpg"; 
import hero2 from "../assets/waterfall1.jpg"; 
import hero3 from "../assets/tiger1.jpg"; 
import hero4 from "../assets/elephantride.jpg"; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState, useEffect } from "react";

// --- DUMMY COMPONENTS (Required for Single File Mandate) ---
const darkPurple = "#52368c";
const lightPurple = "#B749DB";

// Helper component for creating styled image placeholders with a specific URL pattern
const PlaceholderImage = ({ alt, url, className }: { alt: string, className?: string, url?: string }) => (
  <img
    src={url}
    alt={alt}
    className={`w-full h-full object-cover ${className}`}
    onError={(e) => {
      // Fallback in case placehold.co is blocked/slow
      const img = e.target as HTMLImageElement;
      img.onerror = null;
      img.src = "https://placehold.co/400x300/e0e0e0/52368c?text=Image";
    }}
  />
);

// Data Definitions
const STATS = [
  { num: "72", label: "Destinations"},
  { num: "250 K", label: "Total Customers" },
  { num: "4.8/5", label: "User Reviews" },
];

const VALUES = [
  { icon: FaHeart , title: "Customer Satisfaction", content: "Vibes Lanka is committed to offering unforgettable travel experiences with personalized service and attention to detail, making your journey truly special." },
  { icon: FaStarOfLife, title: "Quality Service", content: "We are committed to providing high-quality service in every aspect of our operations, from luxurious accommodations to personalized itineraries." },
  { icon: FaPlane, title: "Innovation", content: "We continually seek innovative ways to enhance our services and provide unique travel experiences that cater to the evolving needs of our travelers." },
  { icon: FaCoins, title: "Affordability", content: "We are committed to offering luxurious travel experiences at affordable prices, ensuring that the wonders of Sri Lanka are accessible to all." },
  { icon: FaGlobe, title: "Sustainability", content: "We are dedicated to sustainable tourism practices that protect and preserve the natural beauty and cultural heritage of Sri Lanka for future generations." },
];

// --- ANIMATION VARIANTS ---
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerCards = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// --- CORE COMPONENT ---
export default function AboutUs() {

  const [backgroundIndex, setBackgroundIndex] = useState(0);

  // Array of images for the slideshow
  const images = [hero, hero2, hero3,hero4];

  // Function to change background image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  // --- Image Collage Component (used in Hero and Sustainability sections)
  interface ImageType {
    url: string;
  }

  const ImageCollage = ({ images, className = "", rotate = true }: { images: ImageType[], className?: string, rotate?: boolean }) => (
    <div className={`relative w-full h-[650px] md:h-[550px] ${className}`}>
      {images.map((img, index) => (
        <motion.div
          key={index}
          className="absolute w-3/5 h-3/4 rounded-xl shadow-2xl overflow-hidden bg-gray-200 border-4 border-white "
          initial={{ opacity: 0, x: -100, rotate: rotate ? (index % 2 === 0 ? -10 : 10) : 0 }}  // Initially hidden (off-screen)
          whileInView={{ opacity: 1, x: 0, rotate: rotate ? (index % 2 === 0 ? -15 : 10) : 0, transition: { duration: 0.8, delay: index * 0.15 } }}  // Reveals images with slide animation
          viewport={{ once: true, amount: 0.4 }}  // Only trigger when images are in view
          style={{
            zIndex: images.length - index,
            top: `${index * 10}%`,
            left: `${index * 5}%`,
            transformOrigin: 'top left',
          }}
        >
          <PlaceholderImage alt={`Vibes Lanka Image ${index + 1}`} url={img.url} />
        </motion.div>
      ))}
    </div>
  );

  // Define images for the collages - Using descriptive placeholders for better visualization
  const heroImages = [
    { url: "../src/assets/tiger.jpg" }, 
    { url: "../src/assets/swing.jpg"  }, 
    { url: "../src/assets/elephantride.jpg"  }, 
    { url: "../src/assets/Snorkeling.jpg"  }, 
  ];

  // Images for Sustainability Section (121307.png)
  const sustainabilityImages = [
    { url: "../src/assets/sustainablityImage/elephant.jpg" },
    { url: "../src/assets/sustainablityImage/nineedge.jpg" },
    { url: "../src/assets/sustainablityImage/gallefort.jpg" },
  ];

  return (
    <div className="bg-white font-sans text-gray-800 overflow-x-hidden">
      <Navbar />

      {/* --- 1. Hero / Welcome Section (Image Background - Full Screen) --- */}
      <motion.div
        className="relative h-screen bg-cover bg-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background Image Slideshow */}
        <motion.div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${images[backgroundIndex]})`, // Dynamically change background image
          }}
          transition={{
            duration: 0.3,
            ease: "linear",
          }}
        >
          {/* Overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-bl from-white/90 via-black/10 to-transparent"></div>
        </motion.div>


        {/* Text Content */}
        <div className="relative z-10 flex items-center h-full px-6 lg:px-24 text-white font-poppins">
          <div className="max-w-3xl space-y-6">
            {/* Heading */}
            <motion.h1
              className="text-[36px] md:text-[85px] font-semibold leading-tight mb-10 mt-10"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              
            >
              Discover the Timeless Charms of Sri Lanka
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="text-xl md:text-[40px] font-poppins mb-40 font-medium "
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
            >
              Step into a world where nature and culture weave unforgettable tales.
            </motion.p>
          </div>
        </div>
      </motion.div>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        {/* --- 1.1 Welcome Text & Image Collage (Now separated into Left/Right Columns) --- */}
        <section className="mb-24 pt-10"> {/* text-center removed */}
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Column: Image Collage */}
            <motion.div
              className="w-full lg:w-1/2 max-w-xl mx-auto mb-10 lg:mb-0" // W-1/2 for left alignment on large screens
              initial={{ opacity: 0, x: -100, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1, transition: { duration: 1 } }}
              viewport={{ once: true }}
            >
              <ImageCollage images={heroImages} rotate={true} className="mx-auto" />
            </motion.div>

            {/* Right Column: Welcome Text */}
            <motion.div
              className="w-full lg:w-1/2 max-w-4xl mx-auto space-y-8 mt-12 lg:mt-0 text-center lg:text-left font-albertsans " // W-1/2 for right alignment on large screens. Text left-aligned on large screens.
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <p className="text-xl text-gray-500 italic" >
                Imagine a place where verdant landscapes meet golden beaches, where ancient temples whisper stories of a rich past, and where vibrant festivals bring to life the heart and soul of a culture.
              </p>
              <p className="text-lg leading-relaxed text-gray-700 font-bold">
                Welcome to Sri Lanka, and welcome to Vibes Lanka Travels and Tours. Here, every journey is meticulously crafted to not only showcase the breathtaking beauty of our island but also to immerse you in its profound heritage and captivating spirit. We believe that travel is more than just seeing places; it's about creating memories, forging connections, and experiencing the world in its most authentic form. **Join us as we embark on a journey that changes your perspective and leaves you with a deep appreciation for the Pearl of the Indian Ocean.**
              </p>
            </motion.div>
          </div>
        </section>

        {/* --- 2. Vision & Mission Section --- */}
        <section className="mb-24">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20"
            variants={staggerCards}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Vision Card */}
            <motion.div
                variants={cardItem}
                className="relative p-12 h-96 rounded-3xl overflow-hidden shadow-2xl group"
            >
                <div className="absolute inset-0 bg-gradient-to-t  from-purple-950/70 via-purple-300/30 to-transparent"></div>
                <div className="relative text-Black h-full flex flex-col justify-end">
                    <h3 className="text-5xl font-extrabold mb-4" >Vision</h3>
                    <p className="text-lg leading-relaxed">
                    To be the leading travel company in Sri Lanka, known for creating unforgettable journeys that combine luxury, cultural immersion, and exceptional value, while showcasing the natural beauty and rich heritage of our island.
                    </p>
                </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div
                variants={cardItem}
                className="relative p-12 h-96 rounded-3xl overflow-hidden shadow-2xl group"
            >   
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/70 via-purple-300/30 to-transparent"></div>
                <div className="relative text-Black  h-full flex flex-col justify-end">
                    <h3 className="text-5xl font-extrabold mb-4">Mission</h3>
                    <p className="text-lg leading-relaxed">
                    At Vibes Lanka Travels and Tours, our mission is to turn your travel dreams into reality by offering personalized, affordable luxury travel experiences. We are dedicated to providing outstanding service, ensuring comfort and convenience...
                    </p>
                </div>
            </motion.div>
          </motion.div>

          {/* Stats (Moved below V/M) */}
          <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
              variants={staggerCards}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
          >
              {STATS.map((item, index) => (
                  <motion.div
                      key={index}
                      variants={cardItem}
                      className="p-8 bg-gray-50 rounded-xl shadow-lg border-t-4 transition duration-300 hover:shadow-xl hover:border-t-4"
                      style={{ borderTopColor: lightPurple }}
                  >
                      <h3 className="text-5xl font-extrabold mb-1" style={{ color: darkPurple }}>
                          {item.num}
                          <span className="text-2xl font-bold ml-1" style={{ color: lightPurple }}>{item.suffix}</span>
                      </h3>
                      <p className="text-gray-600 text-lg font-semibold">{item.label}</p>
                  </motion.div>
              ))}
          </motion.div>
        </section>

        {/* --- 3. Core Values Section (Updated Layout and Content) --- */}
        <section className="mb-24">
          <motion.div 
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4" style={{ color: darkPurple }}>
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Our service is built on a foundation of core values that ensure an exceptional and memorable travel experience from the moment you contact us.
            </p>
          </motion.div>

          {/* Value Cards - 3 columns then 2 columns layout */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerCards}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* First 3 cards in the first row (3 columns) */}
            {VALUES.slice(0, 3).map((item, index) => (
              <motion.div
                key={index}
                variants={cardItem}
                className="p-8 bg-white rounded-xl shadow-lg border border-gray-200 transition duration-300 hover:shadow-2xl hover:border-[#B749DB] cursor-pointer"
              >
                <div className="flex items-center space-x-3 mb-3">
                    <item.icon className="h-8 w-8" style={{ color: lightPurple }}/>
                    <h4 className="text-2xl font-bold" style={{ color: darkPurple }}>{item.title}</h4>
                </div>
                <p className="text-gray-600 text-base">{item.content}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Second row of cards (2 columns, centered) */}
          <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto"
              variants={staggerCards}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
          >
              {VALUES.slice(3, 5).map((item, index) => (
                <motion.div
                  key={index}
                  variants={cardItem}
                  className="p-8 bg-white rounded-xl shadow-lg border border-gray-200 transition duration-300 hover:shadow-2xl hover:border-[#B749DB] cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-3">
                      <item.icon className="h-8 w-8" style={{ color: lightPurple }}/>
                      <h4 className="text-2xl font-bold" style={{ color: darkPurple }}>{item.title}</h4>
                  </div>
                  <p className="text-gray-600 text-base">{item.content}</p>
                </motion.div>
              ))}
          </motion.div>
        </section>

        {/* --- 4. Promoting Sustainable Travelling (New from 121307.png) --- */}
        <section className="mb-14 pt-14">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <motion.div
                  className="w-full lg:w-1/2 min-h-[550px]"
                  initial={{ opacity: 0, x: -100, scale: 0.9 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1, transition: { duration: 1 } }}
                  viewport={{ once: true }}
                >
                  <ImageCollage images={sustainabilityImages} rotate={true} className="translate-x-12" />
                </motion.div>
                <motion.div
                  className="w-full lg:w-1/2 space-y-6 mt-12 lg:mt-0 lg:text-left text-center"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <h2 className="text-4xl md:text-5xl font-extrabold" style={{ color: darkPurple }}>
                    Promoting Sustainable Travelling
                  </h2>
                  <p className="text-xl leading-relaxed text-gray-700">
                    Vibes Lanka is committed to sustainable travel practices, making sure that our beautiful island remains a paradise for generations to come.
                  </p>
                  <button className="inline-flex items-center space-x-2 bg-[#B749DB] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#a537c7] transition transform hover:scale-105">
                    <span>Learn More</span>
                    <FaArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
