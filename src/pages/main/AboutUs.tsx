import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaGlobe, FaHeart, FaStarOfLife, FaCoins, FaPlane } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import hero from "../../assets/Swing.jpg";
import hero2 from "../../assets/waterfall1.jpg";
import hero3 from "../../assets/tiger1.jpg";
import hero4 from "../../assets/elephantride.jpg";
import Navbar from '../../components/home/Navbar';
import Footer from '../../components/home/Footer';
import { useState, useEffect } from "react";
import type { Variants } from "framer-motion";

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

// --- CORE COMPONENT ---
export default function AboutUs() {
  const { t } = useTranslation();

  const STATS = [
    { num: "72", label: t('about.statsDestinations') },
    { num: "250 K", label: t('about.statsCustomers') },
    { num: "4.8/5", label: t('about.statsReviews') },
  ];

  const VALUES = [
    { icon: FaHeart, title: t('about.value1Title'), content: t('about.value1Text') },
    { icon: FaStarOfLife, title: t('about.value2Title'), content: t('about.value2Text') },
    { icon: FaPlane, title: t('about.value3Title'), content: t('about.value3Text') },
    { icon: FaCoins, title: t('about.value4Title'), content: t('about.value4Text') },
    { icon: FaGlobe, title: t('about.value5Title'), content: t('about.value5Text') },
  ];

  const [backgroundIndex, setBackgroundIndex] = useState(0);

  // Array of images for the slideshow
  const images = [hero, hero2, hero3, hero4];

  // Function to change background image every 5 seconds and preload images
  useEffect(() => {
    // Preload images
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const interval = setInterval(() => {
      setBackgroundIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Increased slightly for better viewing

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
          className="absolute w-3/5 h-3/4 rounded-xl shadow-2xl overflow-hidden bg-gray-200 border-4 border-white will-change-transform"
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
    { url: "../src/assets/swing.jpg" },
    { url: "../src/assets/elephantride.jpg" },
    { url: "../src/assets/Snorkeling.jpg" },
  ];

  // Images for Sustainability Section (121307.png)
  const sustainabilityImages = [
    { url: "../src/assets/sustainablityImage/elephant.jpg" },
    { url: "../src/assets/sustainablityImage/nineedge.jpg" },
    { url: "../src/assets/sustainablityImage/gallefort.jpg" },
  ];

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const staggerCards = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.8,
      },
    },
  };

  const cardItem = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <div className="bg-white font-sans text-gray-800 overflow-x-hidden">
      <Navbar />

      {/* --- 1. Hero / Welcome Section (Image Background - Full Screen) --- */}
      <motion.div
        className="relative h-screen bg-cover bg-center overflow-hidden bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background Image Slideshow */}
        <AnimatePresence>
          <motion.div
            className="absolute inset-0 w-full h-full bg-cover bg-center will-change-opacity"
            style={{
              backgroundImage: `url(${images[backgroundIndex]})`, // Dynamically change background image
            }}
            key={backgroundIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
            }}
          >
            {/* Overlay for contrast */}
            <div className="absolute inset-0 bg-linear-to-bl from-white/90 via-black/10 to-transparent"></div>
          </motion.div>
        </AnimatePresence>


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
              {t('about.heroTitle')}
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="text-xl md:text-[40px] font-poppins mb-40 font-medium "
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
            >
              {t('about.heroSubtitle')}
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
                {t('about.welcomeText1')}
              </p>
              <p className="text-lg leading-relaxed text-gray-700 font-bold">
                {t('about.welcomeText2')}
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
              className="relative p-12 h-96 rounded-3xl overflow-hidden shadow-2xl group will-change-transform"
            >
              <div className="absolute inset-0 bg-linear-to-bl from-purple-950/70 via-purple-300/30 to-transparent"></div>
              <div className="relative text-Black h-full flex flex-col justify-end">
                <h3 className="text-5xl font-albertsans font-extrabold mb-4" >{t('about.visionTitle')}</h3>
                <p className="text-lg font-albertsans leading-relaxed">
                  {t('about.visionText')}
                </p>
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              variants={cardItem}
              className="relative p-12 h-96 rounded-3xl overflow-hidden shadow-2xl group will-change-transform"
            >
              <div className="absolute inset-0 bg-linear-to-bl from-purple-950/70 via-purple-300/30 to-transparent"></div>
              <div className="relative text-Black  h-full flex flex-col justify-end">
                <h3 className="text-5xl font-albertsans font-extrabold mb-4">{t('about.missionTitle')}</h3>
                <p className="text-lg font-albertsans leading-relaxed">
                  {t('about.missionText')}
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
                <h3 className="text-5xl font-roboto font-extrabold mb-1" style={{ color: darkPurple }}>
                  {item.num}
                  {/* No suffix property, so nothing to render here */}
                </h3>
                <p className="text-gray-600 font-nunito text-lg font-semibold">{item.label}</p>
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
              {t('about.valuesTitle')}
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              {t('about.valuesSubtitle')}
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
                className="p-8 bg-white rounded-xl shadow-lg border border-gray-200 transition duration-300 hover:shadow-2xl hover:border-[#B749DB] cursor-pointer will-change-transform"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <item.icon className="h-8 w-8" style={{ color: lightPurple }} />
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
                  <item.icon className="h-8 w-8" style={{ color: lightPurple }} />
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
              className="w-full lg:w-1/2 space-y-6 mt-12 lg:mt-0 lg:text-left text-center will-change-transform"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold" style={{ color: darkPurple }}>
                {t('about.sustainableTitle')}
              </h2>
              <p className="text-xl leading-relaxed text-gray-700">
                {t('about.sustainableText')}
              </p>
              <button className="inline-flex items-center space-x-2 bg-[#B749DB] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-[#a537c7] transition transform hover:scale-105">
                <span>{t('about.learnMore')}</span>
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
