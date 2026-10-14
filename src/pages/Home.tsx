import { Hero } from "../components/Hero";
import { Experience } from "../components/Experience";
import { Education } from "../components/Education";
import { Projects } from "../components/Projects";
import { Skills } from "../components/Skills";

export default function Home() {
  return (
    <>
      <Hero />
      <Experience />
      <Education />
      <Projects />
      <Skills />
    </>
  );
}
