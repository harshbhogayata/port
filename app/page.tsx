import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import SelectedWork from "@/components/home/SelectedWork";
import Principles from "@/components/home/Principles";
import Stack from "@/components/home/Stack";
import Experience from "@/components/home/Experience";
import OpenSource from "@/components/home/OpenSource";
import Writing from "@/components/home/Writing";
import Recognition from "@/components/home/Recognition";
import Testimonials from "@/components/home/Testimonials";
import NowTeaser from "@/components/home/NowTeaser";
import { ScrollRefresh } from "@/components/motion/Motion";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <SelectedWork />
      <Principles />
      <Stack />
      <Experience />
      <OpenSource />
      <Writing />
      <Recognition />
      <Testimonials />
      <NowTeaser />
      <ScrollRefresh />
    </>
  );
}
