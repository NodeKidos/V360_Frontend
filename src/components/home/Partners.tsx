import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

// Import images
import hilton from "../../assets/hotels/hilton.jpg";
import cityOfDream from "../../assets/hotels/cityof dream.jpg";
import goldenCrown from "../../assets/hotels/golden crown.jpg";
import forthouse from "../../assets/hotels/forthouse.jpg";

const partners = [
  {
    name: "Hilton Hotel",
    location:
      "No.2 Sir Chittampalam A Gardiner, Mawatha, Colombo, 00200, Sri Lanka",
    city: "Colombo",
    image: hilton,
  },
  {
    name: "Cinnamon Grand city of Dream",
    location: "No.01 Justice Akbar Mawatha, Colombo 00200, Sri Lanka",
    city: "Colombo",
    image: cityOfDream,
  },
  {
    name: "Golden Crown",
    location: "322, Udagama, Ampitiya, Kandy, Sri Lanka",
    city: "Kandy",
    image: goldenCrown,
  },
  {
    name: "Fourth House",
    location: "72 Church Street, Galle, Sri Lanka",
    city: "Galle",
    image: forthouse,
  },
  {
    name: "Hilton Hotel",
    location:
      "No.2 Sir Chittampalam A Gardiner, Mawatha, Colombo, 00200, Sri Lanka",
    city: "Colombo",
    image: hilton,
  },
  {
    name: "Cinnamon Grand city of Dream",
    location: "No.01 Justice Akbar Mawatha, Colombo 00200, Sri Lanka",
    city: "Colombo",
    image: cityOfDream,
  },
  {
    name: "Golden Crown",
    location: "322, Udagama, Ampitiya, Kandy, Sri Lanka",
    city: "Kandy",
    image: goldenCrown,
  },
];

export default function Partners() {
  // Variants for smooth staggered horizontal entry
  interface CardVariants {
    [key: string]: any;
    hidden: {
      opacity: number;
      x: number;
      scale: number;
    };
    visible: (i: number) => {
      opacity: number;
      x: number;
      scale: number;
      transition: {
        delay: number;
        duration: number;
        ease: string;
      };
    };
  }

  const cardVariants: CardVariants = {
    hidden: { opacity: 0, x: 100, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <div className="py-16 bg-white overflow-hidden">
      {/* Heading */}
      <h2 className="text-[48px] font-semibold mb-8 text-left pl-16 pr-16 font-roboto-condensed">
        Our Trusted Partners
      </h2>

      {/* Paragraph */}
      <p className="text-[25px] font-normal text-gray-700 mb-12 text-left pl-16 pr-16 font-roboto-condensed">
        Discover Sri Lanka's magic with Vibes Lanka Travel and Tours. Where our
        packages suit every vibe – from romance to family adventure and beyond.
      </p>

      {/* Horizontal Scroll Section */}
      <motion.div
        className="flex gap-8 overflow-x-auto px-16 scrollbar-hide scroll-smooth"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {partners.map((partner, index) => (
          <motion.div
            key={index}
            className="min-w-[312px]  bg-white rounded-xl shadow-lg h-[512px] relative overflow-hidden scroll-snap-align-start"
            custom={index}
            initial="hidden"
            whileInView="visible"
            variants={cardVariants}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -6 }}
          >
            {/* Partner Image */}
            <div className="relative w-full h-full">
              <img
                src={partner.image}
                alt={partner.name}
                className="w-full h-full object-cover rounded-t-xl"
              />

              {/* City Badge */}
              <div className="absolute top-4 right-4 bg-white text-black py-1 px-4 rounded-full text-sm font-roboto-condensed shadow-md">
                {partner.city}
              </div>

              {/* Overlay Text */}
              <div className="absolute bottom-16 left-4 text-white font-roboto-condensed drop-shadow-lg">
                <h3 className="font-semibold text-[20px]">{partner.name}</h3>
                <p className="text-[15px]">{partner.location}</p>
              </div>
            </div>

            {/* Arrow Icon */}
            <motion.div
              className="absolute bottom-4 right-4 p-2 bg-[#B749DB] rounded-full flex items-center justify-center shadow-md cursor-pointer transition-transform duration-300"
              whileHover={{ rotate: -45 }}
            >
              <FaArrowRight size={20} className="text-white" />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
