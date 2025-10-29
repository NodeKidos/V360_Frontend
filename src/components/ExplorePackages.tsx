import bgImage from "../assets/travel.jpg"; // Background image
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
  
  
];

export default function ExplorePackages() {
  return (
    <div
      className="relative bg-cover bg-center text-white py-24"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay for contrast */}
      <div className="absolute inset-0  bg-opacity-50"></div>

      {/* Main Section */}
      <div className="relative z-10 mx-auto px-16 flex flex-col md:flex-row justify-between gap-50">
        
        {/* Left Side - Text */}
        <div className="w-full md:w-1/2 ">
          <h2 className="text-[48px] font-bold text-left mb-6 font-roboto-condensed">
            Explore Our Packages
          </h2>
          <p className="text-[25px] font-normal text-gray-200 font-roboto-condensed leading-relaxed">
            Embark on a thrilling journey through the wilderness with activities
            like trekking, zip-lining, and wildlife safaris. These packages are
            designed for those who crave adventure, relaxation, or a spiritual
            connection with nature.
          </p>
        </div>

        {/* Right Side - Two Package Cards */}
        <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
            >
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-[400px] object-cover"
              />
              <div className="p-5 text-black">
                <h3 className="text-[22px] font-semibold mb-2 font-roboto-condensed">
                  {pkg.title}
                </h3>
                <p className="text-[16px] text-gray-700 font-roboto-condensed">
                  {pkg.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
