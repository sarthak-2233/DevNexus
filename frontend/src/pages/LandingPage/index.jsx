import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustedStack from "./components/TrustedStack";
import Agents from "./components/Agents";
import Memory from "./components/Memory";
import Pillars from "./components/Pillars";
import CodeSnippet from "./components/CodeSnippet";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";
import { motion, useScroll } from "motion/react";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  return (
    <>
      <motion.div style={{ scaleX: scrollYProgress }}
        className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-gradient-to-r from-gold to-copper" />
      <Header />
      <main id="top">
        <Hero />
        <TrustedStack />
        <Agents />
        <Memory />
        <Pillars />
        <CodeSnippet />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
