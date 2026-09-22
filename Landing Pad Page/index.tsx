"use client";

import React, { useState, useRef, useEffect } from "react";
import { Navbar } from "./Navbar";
import { HeroSection } from "./Hero Section";
import FooterNav from "../landing-page/footer-nav";
import FooterWatermark from "../landing-page/footer-watermark";
import { FooterStickyReveal } from "@/components/ui/footer-sticky-reveal";
import BentoGrid from "../landing-page/bentoGrid/BentoGrid";
import Timeline from "../landing-page/timeline";
import HorizontalScroll from "../landing-page/horizontal-scroll";
import FaqSection from "../landing-page/faq";
import MethodologySection from "../landing-page/methodology-section";
import PricingSection from "../landing-page/pricing-section";
import CtaSection from "../landing-page/cta-section";
import PageLoader from "../landing-page/page-loader";
//import ScrollReveal from "@/components/ui/scroll";
import SlowManifestoReveal from "@/components/ui/slow-manifesto";
import { useGlobalAnimations } from "@/hooks/use-global-animations";

const manifestoText = "SovereignX is an AI security platform built for organizations that cannot afford to surrender control of their intelligence. It brings powerful AI into your own infrastructure — on-premise, air-gapped, and governed by the people who own the data. With human-in-the-loop oversight, every critical decision remains accountable, auditable, and under your control. SovereignX turns AI from a dependency on external infrastructure into intelligence you can truly own.";

/**
 * LandingPadPage
 * 
 * A drop-in landing page component combining the scroll-aware Navbar 
 * and the cinematic Hero Section. It manages the shared audio state.
 */
export default function LandingPadPage() {
  useGlobalAnimations();

  const [loaderDone, setLoaderDone] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);

      // If we are unmuting and it's not playing, start it
      if (!newMutedState && !isPlaying) {
        audioRef.current.play().catch(() => {
          console.log("Autoplay prevented by browser.");
        });
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, []);

  return (
    <main className="min-h-screen bg-black">
      {/* Page loader — unmounts itself once PixelSwap exit completes */}
      {!loaderDone && <PageLoader onDone={() => setLoaderDone(true)} />}
      {/* Background Music Player */}
      <audio ref={audioRef} loop>
        <source src="/bgm.mp3" type="audio/mpeg" />
      </audio>

      <Navbar
        isMuted={isMuted}
        toggleMute={toggleMute}
        volume={volume}
        onVolumeChange={handleVolumeChange}
      />

      <HeroSection isMuted={isMuted} volume={volume} loaderDone={loaderDone} />

      <div id="about" className="w-full h-0 pointer-events-none" />
      <SlowManifestoReveal>
        {manifestoText}
      </SlowManifestoReveal>

      <div id="architecture" className="w-full h-0 pointer-events-none" />
      <BentoGrid />

      <div id="approach" className="w-full h-0 pointer-events-none" />
      <HorizontalScroll />
      <MethodologySection />

      <div id="faqs" className="w-full h-0 pointer-events-none" />
      <FaqSection />

      <CtaSection />

      <div id="pricing" className="w-full h-0 pointer-events-none" />
      <PricingSection />

      <FooterNav />

      <FooterStickyReveal>
        <FooterWatermark />
      </FooterStickyReveal>
    </main>
  );
}
