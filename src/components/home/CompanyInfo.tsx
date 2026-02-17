import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CompanyInfoImg1 from "../../assets/companyinfo/temple.jpg";
import CompanyInfoImg2 from "../../assets/companyinfo/trainride.jpg";
import CompanyInfoImg3 from "../../assets/companyinfo/beach.jpg";
import CompanyInfoImg4 from "../../assets/companyinfo/Elephant.jpg";
import CompanyInfoImg5 from "../../assets/companyinfo/Mountain.jpg";
import Statistics from "./statistics";

const CompanyInfo = () => {
  const { t } = useTranslation();
  return (
    <div className="py-16 bg-white">
      {/* Heading and Description with Flex Layout */}
      <div className="flex justify-between items-center mb-12 px-16">
        <div className="w-3/4">
          <h2 className="text-[48px] font-bold mb-4 font-roboto-condensed">
            {t('home.whatWeDo')}
          </h2>
          <p className="text-[25px] font-normal text-gray-700 font-roboto-condensed">
            {t('home.whatWeDoDescription')}
          </p>
        </div>

        {/* Button on the Right */}
        <Link
          to="/itinerary"
          className="text-center bg-[#B749DB] text-white py-2 px-8 rounded-xl hover:bg-purple-700 transition duration-300 text-[16px] font-medium font-roboto-condensed"
        >
          {t('home.beginJourney')}
        </Link>
      </div>


      {/* Image Grid with Centering */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 px-16 pb-5 mx-auto">
        <img
          src={CompanyInfoImg1}
          alt="Sri Lanka Temple"
          className="w-full h-full object-cover rounded-lg"
        />
        <img
          src={CompanyInfoImg2}
          alt="Train Ride"
          className="w-full h-full object-cover rounded-lg"
        />
        <img
          src={CompanyInfoImg3}
          alt="Sri Lanka Beach"
          className="w-full h-full object-cover rounded-lg"
        />
        <img
          src={CompanyInfoImg4}
          alt="Sri Lanka Elephant"
          className="w-full h-full object-cover rounded-lg"
        />
        <img
          src={CompanyInfoImg5}
          alt="Sri Lanka Mountain"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <Statistics />
      {/* New Section for Company Info */}
      <div className="mb-3 mt-10 px-16">
        <h3 className="text-[32px] font-bold mb-4 font-roboto-condensed">
          {t('home.ourExperience')}
        </h3>
        <p className="text-[20px] font-normal text-gray-700 mb-4 font-roboto-condensed">
          {t('home.experienceText1')}
        </p>
        <p className="text-[20px] font-normal text-gray-700 mb-4 font-roboto-condensed">
          {t('home.experienceText2')}
        </p>
        <p className="text-[20px] font-normal text-gray-700 mb-4 font-roboto-condensed">
          {t('home.experienceText3')}
        </p>
      </div>
    </div>
  );
};

export default CompanyInfo;
