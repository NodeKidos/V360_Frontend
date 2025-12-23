import { Link } from "react-router-dom";

// Import images directly from the src folder
import templeImg from "../../assets/companyinfo/temple.jpg";
import trainrideImg from "../../assets/companyinfo/trainride.jpg";
import beachImg from "../../assets/companyinfo/beach.jpg";
import elephantImg from "../../assets/companyinfo/Elephant.jpg";
import mountainImg from "../../assets/companyinfo/Mountain.jpg";
import Statistics from "./statistics";

const CompanyInfo = () => {
  return (
    <div className="py-16 bg-white">
      {/* Heading and Description with Flex Layout */}
      <div className="flex justify-between items-center mb-12 px-16">
        <div className="w-3/4">
          <h2 className="text-[48px] font-bold mb-4 font-roboto-condensed">
            What we do
          </h2>
          <p className="text-[25px] font-normal text-gray-700 font-roboto-condensed">
            Discover Sri Lanka's magic with Vibes Lanka Travel and Tours. Where our packages suit every vibe – from romance to family adventure and beyond.
          </p>
        </div>

        {/* Button on the Right */}
        <Link
          to="/packages"
          className="text-center bg-[#B749DB] text-white py-2 px-8 rounded-xl hover:bg-purple-700 transition duration-300 text-[16px] font-medium font-roboto-condensed"
        >
          Begin Your Journey
        </Link>
      </div>


      {/* Image Grid with Centering */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 px-16 pb-5 mx-auto">
        <img
          src={templeImg}
          alt="Sri Lanka Temple"
          className="w-full h-full object-cover rounded-lg"
        />
        <img
          src={trainrideImg}
          alt="Train Ride"
          className="w-full h-full object-cover rounded-lg"
        />
        <img
          src={beachImg}
          alt="Sri Lanka Beach"
          className="w-full h-full object-cover rounded-lg"
        />
        <img
          src={elephantImg}
          alt="Sri Lanka Elephant"
          className="w-full h-full object-cover rounded-lg"
        />
        <img
          src={mountainImg}
          alt="Sri Lanka Mountain"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <Statistics />
      {/* New Section for Company Info */}
      <div className="mb-3 mt-10 px-16">
        <h3 className="text-[32px] font-bold mb-4 font-roboto-condensed">
          Our Experience
        </h3>
        <p className="text-[20px] font-normal text-gray-700 mb-4 font-roboto-condensed">
          With over 5 years of experience, Vibes Lanka Travel has organized more than 100 unforgettable tours for over 10,000 happy travelers. From serene beach escapes to thrilling safaris, we offer tailored travel packages that suit every need.
        </p>
        <p className="text-[20px] font-normal text-gray-700 mb-4 font-roboto-condensed">
          We are proud to have received numerous accolades for our exceptional services, including recognition from local and international travel associations. Our commitment to quality ensures that every trip is crafted with care and precision.
        </p>
        <p className="text-[20px] font-normal text-gray-700 mb-4 font-roboto-condensed">
          Our packages are designed with you in mind – whether you're looking for a romantic retreat, an adventurous journey, or a family-friendly getaway, Vibes Lanka Travel has something for everyone.
        </p>
      </div>
    </div>
  );
};

export default CompanyInfo;
