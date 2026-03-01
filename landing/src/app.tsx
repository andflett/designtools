import { Nav } from "./components/nav.js";
import { Hero } from "./components/hero.js";
import { DemoWindow } from "./components/demo-window.js";
import { Philosophy } from "./components/philosophy.js";
import { ThreeTiers } from "./components/three-tiers.js";
import { Differentiators } from "./components/differentiators.js";
import { Compatibility } from "./components/compatibility.js";

import { Stack } from "./components/stack.js";
import { Footer } from "./components/footer.js";

export function App() {
  return (
    <>
      <Nav />
      <Hero />
      <DemoWindow />
      <Philosophy />
      <ThreeTiers />
      <Compatibility />
      <Differentiators />
      <Stack />
      <Footer />
    </>
  );
}
