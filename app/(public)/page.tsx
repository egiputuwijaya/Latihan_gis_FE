import Image from "next/image";
import Navbar from "../components/landingPage/Navbar";
import Hero from "../components/landingPage/Hero";
import About from "../components/landingPage/About";
import Features from "../components/landingPage/Features";
import CTA from "../components/landingPage/CTA";
import Footer from "../components/landingPage/Footer";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}
