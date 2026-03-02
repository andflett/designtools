import { useSyncExternalStore } from "react";
import { Nav } from "./components/nav.js";
import { Hero } from "./components/hero.js";
import { DemoWindow } from "./components/demo-window.js";
import { Philosophy } from "./components/philosophy.js";
import { ThreeTiers } from "./components/three-tiers.js";
import { Differentiators } from "./components/differentiators.js";
import { Compatibility } from "./components/compatibility.js";
import { Stack } from "./components/stack.js";
import { Waitlist, WaitlistForm } from "./components/waitlist.js";
import { Footer } from "./components/footer.js";
import { Privacy } from "./components/privacy.js";
import { motion } from "motion/react";

function useHash() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("hashchange", cb);
      return () => window.removeEventListener("hashchange", cb);
    },
    () => window.location.hash,
  );
}

export function App() {
  const hash = useHash();

  if (hash === "#privacy") {
    return (
      <>
        <Nav />
        <Privacy />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <Hero />
      <DemoWindow />
      <div className="max-w-[1100px] mx-auto px-6 relative pt-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
        >
          <WaitlistForm />
        </motion.div>
      </div>
      <Philosophy />
      <ThreeTiers />
      <Compatibility />
      <Differentiators />
      <Stack />
      <Waitlist />
      <Footer />
    </>
  );
}
