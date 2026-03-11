import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import BrandsCarousel from "@/components/BrandsCarousel";
import Mission from "@/components/Mission";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <BrandsCarousel />
      <Mission />
      <ReviewsCarousel />
      <Footer />
    </main>
  );
}
