// app/page.js
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AboutSection from '@/components/About';
import Features from '../components/Features';
import CoursesGrid from '../components/CoursesGrid';
import Universities from '../components/Universities';
import QuoteSection from '../components/QuoteSection';
import Sponsors from '../components/Sponsors';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <Features />
        <CoursesGrid />
        <Universities />
        <QuoteSection />
        <Sponsors />
      </main>
      <Footer />
    </>
  );
}