import Footer from "./Components/Footer";
import Hero from "./Components/Hero";
import Menu from "./Components/Menu";
import Navbar from "./Components/Navbar";
import Reservation from "./Components/Reservation";
import Reviews from "./Components/Reviews";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#001B2E] pt-24 text-white">
      <Navbar />
      <Hero />
      <Menu />
      <Reviews />
      <Reservation />
      <Footer />
    </main>
  );
}
