import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Pricing from "@/components/home/Pricing";
import About from "@/components/home/About";
import FAQ from "@/components/home/FAQ";
import Footer from "@/components/layout/Footer";

export default function Page() {
  return (
    // Menggunakan variabel sistem warna dan memastikan tidak ada scroll horizontal
    <main className="min-h-screen bg-bg-1 text-text-1 font-sans overflow-x-hidden relative">
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}