import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Experience } from "../components/Experience";
import { Education } from "../components/Education";
import { Projects } from "../components/Projects";
import { Skills } from "../components/Skills";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Education />
      <Projects />
      <Skills />
    </>
  );
}
