import CompanyInfo from "../components/CompanyInfo";
import ExplorePackages from "../components/ExplorePackages";
import Footer from "../components/Footer";
import HeroSection from "../components/Hero";
import Navbar from "../components/Navbar";
import Partners from "../components/Partners";
import Testimonials from "../components/Testimonials";


export default function HomePage() {
  return (
    <div>
      <Navbar/>
      <HeroSection />
      <CompanyInfo/>
      <Partners />
      <ExplorePackages />
      <Testimonials />
      <Footer />
    </div>
  );
}
