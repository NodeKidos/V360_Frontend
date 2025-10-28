import { FaArrowRight } from "react-icons/fa"; // Arrow Icon

// Import the images properly
import hilton from "../assets/hotels/hilton.jpg";
import cityOfDream from "../assets/hotels/cityof dream.jpg";
import goldenCrown from "../assets/hotels/golden crown.jpg";
import forthouse from "../assets/hotels/forthouse.jpg";

const partners = [
  {
    name: "Hilton Hotel",
    location: "No.2 Sir Chittampalam A Gardiner, Mawatha, Colombo, 00200, Sri Lanka", 
    city: "Colombo", 
    image: hilton,
  },
  {
    name: "Cinnamon Grand city of Dream",
    location: "No.01 Justice Akbar Mawatha, Colombo 00200,Sri Lanka", 
    city: "Colombo", 
    image: cityOfDream,
  },
  {
    name: "Golden Crown",
    location: "322, Udagama, Ampitiya , Kandy, Sri lanka", 
    city: "Kandy", 
    image: goldenCrown,
  },
  {
    name: "Fourth House",
    location: "72 Church Street,Galle, Sri Lanka", 
    city: "Galle", 
    image: forthouse,
  },
];

export default function Partners() {
  return (
    <div className="py-16 bg-white">
      {/* Heading */}
      <h2 className="text-5xl font-semibold mb-8 text-left pl-26 font-roboto-condensed">
        Our Trusted Partners
      </h2>
      <p className="text-lg mb-12 text-left pl-26 font-roboto-condensed">
        Discover Sri Lanka's magic with Vibes Lanka Travel and Tours. Where our packages suit every vibe – from romance to family adventure and beyond.
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-26">
        {partners.map((partner, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg w-[312px] h-[513px] relative transition-transform transform hover:scale-105 flex flex-col justify-between overflow-hidden"
          >
            {/* Partner Image */}
            <div className="relative w-full h-full">
              <img
                src={partner.image}
                alt={partner.name}
                className="w-full h-full object-cover rounded-t-xl"
              />

              {/* Location Badge at Top Right (only displays the city name) */}
              <div className="absolute top-4 right-4 bg-white text-black py-1 px-4 rounded-full text-sm font-roboto-condensed">
                {partner.city} {/* This will display the city name (e.g., Colombo) */}
              </div>

              {/* Overlay Text and Partner Info */}
              <div className="absolute bottom-15 font-roboto-condensed left-4 text-white">
                <h3 className="font-semibold text-[20px]">{partner.name}</h3>
                <p className="text-[16px]">{partner.location}</p> {/* Full address */}
              </div>
            </div>

            {/* Arrow Icon inside a circle */}
            <div className="absolute bottom-4 right-4 p-2 bg-[#B749DB] rounded-full flex items-center justify-center shadow-md">
              <FaArrowRight size={20} className="text-white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
