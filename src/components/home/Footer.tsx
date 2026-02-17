import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import logo from "../../assets/favicon.png";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#d9d9d9] text-gray-800 rounded-tl-[25px] rounded-tr-[25px]">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 font-roboto-condensed">
        {/* Left Section - Logo and Info */}
        <div className="flex flex-col items-center md:items-start">
          <img src={logo} alt="Vibe Lanka" className="w-32 mb-3" />
          <p className="text-[16px] md:text-[16px] lg:text-[20px] mb-4 font-medium text-center md:text-justify">
            {t('footer.tagline')}
          </p>
          <div className="flex space-x-4 text-[26px] justify-center md:justify-start">
            <a href="#" className="hover:text-purple-600">
              <FaXTwitter />
            </a>
            <a href="#" className="hover:text-purple-600">
              <FaTiktok />
            </a>
            <a href="#" className="hover:text-purple-600">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-purple-600">
              <FaInstagram />
            </a>
          </div>
        </div>
        {/* About Us */}
        <div>
          <h3 className="font-semibold mb-3 text-[18px] md:text-[16px] lg:text-[20px] text-center md:text-justify">{t('footer.aboutUs')}</h3>
          <ul className="space-y-2 text-[18px] md:text-[20px] lg:text-[24px] font-normal text-center md:text-justify">
            <li><a href="#" className="hover:text-purple-600">{t('footer.whoWeAre')}</a></li>
            <li><a href="#" className="hover:text-purple-600">{t('footer.reviews')}</a></li>
            <li><a href="#" className="hover:text-purple-600">{t('footer.blogs')}</a></li>
            <li><a href="#" className="hover:text-purple-600">{t('footer.contact')}</a></li>
          </ul>
        </div>

        {/* Travel Tips */}
        <div>
          <h3 className="font-semibold mb-3 text-[18px] md:text-[16px] lg:text-[20px] text-center md:text-justify">{t('footer.travelTips')}</h3>
          <ul className="space-y-2 text-[18px] md:text-[20px] lg:text-[24px] font-normal text-center md:text-justify">
            <li><a href="#" className="hover:text-purple-600">{t('footer.packages')}</a></li>
            <li><a href="#" className="hover:text-purple-600">{t('footer.destination')}</a></li>
            <li><a href="#" className="hover:text-purple-600">{t('footer.thingsToDo')}</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold mb-3 text-[18px] md:text-[16px] lg:text-[20px] text-center md:text-justify">{t('footer.newsletter')}</h3>
          <p className="text-[18px] md:text-[20px] lg:text-[24px] font-normal leading-relaxed text-center md:text-justify">
            {t('footer.newsletterText')}
          </p>
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-gray-400 font-roboto-condensed font-medium py-4 px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-800">
        <p>{t('footer.rights')}</p>
        <div className="flex space-x-6 mt-2 md:mt-0 font-medium">
          <a href="#" className="hover:text-purple-600">{t('footer.privacy')}</a>
          <a href="#" className="hover:text-purple-600">{t('footer.terms')}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
