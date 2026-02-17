import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { TbWorld } from "react-icons/tb";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/favicon.png";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between relative z-50">
      {/* === LEFT: Hamburger Icon (Visible only on iPhone-sized screens) === */}
      <button
        className="text-purple-500 block md:hidden"
        onClick={() => setIsMenuOpen(true)}
      >
        <FaBars size={24} />
      </button>

      {/* === CENTER: Logo === */}
      <img src={logo} alt="Vibes Lanka" className="w-24 object-contain" />

      {/* === RIGHT: Notification Icon === */}
      <div className="relative md:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
      </div>

      {/* === DESKTOP NAVIGATION (visible on >=768px) === */}
      <div className="hidden md:flex items-center space-x-6 font-roboto-condensed font-medium">
        <ul className="flex space-x-6 text-lg">
          <li>
            <Link to="/home" className="text-gray-700 hover:text-purple-600">
              {t('home.navHome')}
            </Link>
          </li>
          <li>
            <Link to="/itinerary" className="text-gray-700 hover:text-purple-600">
              {t('home.navItinerary')}
            </Link>
          </li>
          <li>
            <Link to="/about-us" className="text-gray-700 hover:text-purple-600">
              {t('home.navAboutUs')}
            </Link>
          </li>
        </ul>

        <Link
          to="/login"
          className="text-lg font-semibold text-white bg-[#B749DB] py-2 px-6 rounded-md hover:bg-purple-700 transition"
        >
          {t('home.navLogin')}
        </Link>

        <span className="text-lg font-bold text-gray-700">LKR</span>

        <div className="flex items-center space-x-3">
          <div className="relative group/lang">
            <button className="text-gray-700 hover:text-purple-600 flex items-center gap-1 py-2">
              <TbWorld size={22} />
            </button>
            <div className="absolute right-0 top-full mt-0 w-48 bg-white shadow-xl rounded-xl border border-purple-50 opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all duration-200 z-50 py-2">
              <div className="px-4 py-2 border-b border-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                {t('home.selectLanguage')}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {[
                  { code: 'en', name: 'English' },
                  { code: 'si', name: 'Sinhala' },
                  { code: 'ta', name: 'Tamil' },
                  { code: 'zh', name: 'Chinese' },
                  { code: 'nl', name: 'Dutch' },
                  { code: 'hi', name: 'Hindi' },
                  { code: 'fr', name: 'French' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-purple-50 transition-colors flex items-center justify-between ${i18n.language === lang.code ? 'text-purple-600 font-bold bg-purple-50/50' : 'text-gray-700'
                      }`}
                  >
                    {lang.name}
                    {i18n.language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button className="text-gray-700 hover:text-purple-600">
            <IoMdInformationCircleOutline size={22} />
          </button>
        </div>
      </div>

      {/* === SIDEBAR MENU (Mobile ≤390px) === */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 flex flex-col p-6 space-y-6 md:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-purple-600">Menu</h2>
                <button
                  className="text-gray-700 hover:text-purple-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaTimes size={22} />
                </button>
              </div>

              {/* Links */}
              <ul className="space-y-10 text-lg font-medium text-gray-700">
                <li>
                  <Link
                    to="/home"
                    className="hover:text-purple-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('home.navHome')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/itinerary"
                    className="hover:text-purple-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('home.navItinerary')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about-us"
                    className="hover:text-purple-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('home.navAboutUs')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-white bg-purple-600 px-4 py-2 rounded-md block text-center hover:bg-purple-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('home.navLogin')}
                  </Link>
                </li>
              </ul>

              {/* Bottom Section */}
              <div className="pt-4 border-t space-y-4">
                <div className="flex flex-wrap gap-2">
                  {['en', 'si', 'ta', 'zh', 'nl', 'hi', 'fr'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        i18n.changeLanguage(lang);
                        setIsMenuOpen(false);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase border transition-all ${i18n.language === lang
                        ? "bg-purple-600 border-purple-600 text-white"
                        : "border-gray-200 text-gray-500 hover:border-purple-300"
                        }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <div className="flex items-center space-x-4">
                  <IoMdInformationCircleOutline
                    size={25}
                    className="text-gray-700 hover:text-purple-600"
                  />
                  <TbWorld size={25} className="text-gray-700 hover:text-purple-600" />
                  <span className="font-semibold text-gray-800">LKR</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
