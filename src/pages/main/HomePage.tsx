import CompanyInfo from "../../components/home/CompanyInfo";
import ExplorePackages from "../../components/home/ExplorePackages";
import Footer from "../../components/home/Footer";
import HeroSection from "../../components/home/Hero";
import Navbar from "../../components/home/Navbar";
import Partners from "../../components/home/Partners";
import Testimonials from "../../components/home/Testimonials";


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
