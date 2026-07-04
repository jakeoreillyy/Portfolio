import { useLenis } from "./lib/useLenis";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Education } from "./components/Education";
import { Projects } from "./components/Projects";
import { Footer } from "./components/Footer";

const placeholders = ["skills", "contact"];

export default function App() {
  useLenis();

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Education />
        <Projects />
        {placeholders.map((id) => (
          <section key={id} id={id} className="flex min-h-screen scroll-mt-20 items-center px-6">
            <div className="mx-auto w-full max-w-5xl">
              <p className="font-mono text-sm text-faint">// {id} — coming soon</p>
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
