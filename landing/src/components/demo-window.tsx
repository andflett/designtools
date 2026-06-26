"use client";

import { useRef, useState } from "react";
import { Reveal } from "./reveal.js";

export function DemoWindow() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function handlePlay() {
    const video = videoRef.current;
    if (!video) return;
    video.play();
    setPlaying(true);
  }

  return (
    <section className="relative z-10 pb-16 pt-12 md:pt-0 md:-mt-[162px]">
      <div className="max-w-[1100px] mx-auto px-6">
        <Reveal>
          <div className="max-w-[960px] mx-auto rounded-md overflow-hidden bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_32px_-8px_rgba(0,0,0,0.08)]">
            <div
              className="relative cursor-pointer"
              onClick={!playing ? handlePlay : undefined}
            >
              <video
                ref={videoRef}
                src="/designtools-surface.mp4"
                poster="/designtools-surface.png"
                controls={playing}
                className="w-full block"
                onEnded={() => setPlaying(false)}
              />
              {!playing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="scale-60 md:scale-100 w-24 h-24 rounded-full bg-white flex items-center justify-center transition-transform hover:scale-110">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="97.533 44.972 12.805 14.02" width="32" height="32" className="relative left-[2px]">
  <rect x="-108.1" y="-50.992" width="2.857" height="2" transform="matrix(-1, 0, 0, -1, 0, 0)" fill="black" />
  <rect x="-108.1" y="-54.992" width="2.857" height="2" transform="matrix(-1, 0, 0, -1, 0, 0)" fill="black" />
  <rect x="-105.24" y="-56.992" width="2.857" height="2" transform="matrix(-1, 0, 0, -1, 0, 0)" fill="black" />
  <rect x="-105.24" y="-48.992" width="2.857" height="2" transform="matrix(-1, 0, 0, -1, 0, 0)" fill="black" />
  <rect x="-102.38" y="-46.992" width="2.857" height="2" transform="matrix(-1, 0, 0, -1, 0, 0)" fill="black" />
  <rect x="-100.39" y="-58.974" width="2.857" height="14.002" transform="matrix(-1, 0, 0, -1, 0, 0)" fill="black" />
  <rect width="2.234" height="2" transform="matrix(1, 0, 0, -1, 0, 0)" fill="black" x="108.104" y="-52.992" />
  <rect x="99.532" y="56.992" width="2.857" height="2" fill="black" />
</svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="max-w-[720px] mx-auto mt-12 grid sm:grid-cols-2 gap-8 text-[14px] leading-relaxed text-ink2">
            <p>
              Surface is a CLI tool that mounts a visual editor on top of your running dev server — no canvas, no separate design file. Click any element in your actual app and a panel opens with precise controls for tokens, spacing, colour, and typography. Every edit writes back to the real source: Tailwind classes, CSS custom properties, or CSS rules, exactly as you'd write them by hand.
            </p>
            <p>
              There are two ways to work. Fine-grained controls let you scrub values, pick from your token scale, and commit changes one property at a time. AI-assisted mode lets you describe what you want and explores the space for you — swapping variants, trying combinations, iterating freely. Both modes write to the same source files. Switch between them as the moment demands.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
