/**
 * Radial Bayer 8×8 ordered dither glow.
 * Same matrix as DitherGradient but dissolves outward from center.
 */

const BAYER_8X8 = [
  [0/64, 48/64, 12/64, 60/64,  3/64, 51/64, 15/64, 63/64],
  [32/64, 16/64, 44/64, 28/64, 35/64, 19/64, 47/64, 31/64],
  [8/64, 56/64,  4/64, 52/64, 11/64, 59/64,  7/64, 55/64],
  [40/64, 24/64, 36/64, 20/64, 43/64, 27/64, 39/64, 23/64],
  [2/64, 50/64, 14/64, 62/64,  1/64, 49/64, 13/64, 61/64],
  [34/64, 18/64, 46/64, 30/64, 33/64, 17/64, 45/64, 29/64],
  [10/64, 58/64,  6/64, 54/64,  9/64, 57/64,  5/64, 53/64],
  [42/64, 26/64, 38/64, 22/64, 41/64, 25/64, 37/64, 21/64],
];

interface DitherGlowProps {
  width?: number;
  height?: number;
  pixelSize?: number;
  color?: string;
  className?: string;
}

export function DitherGlow({
  width = 280,
  height = 80,
  pixelSize = 4,
  color = "rgba(255,255,255,0.15)",
  className = "",
}: DitherGlowProps) {
  const cols = Math.ceil(width / pixelSize);
  const rows = Math.ceil(height / pixelSize);
  const cx = cols / 2;
  const cy = rows / 2;
  const rx = cols / 2;
  const ry = rows / 2;

  // Radial Bayer dither: gradient value drives which threshold pixels appear
  // Dense in center, sparse at edges — the varying density IS the pattern
  // Simple hash for pseudo-random jitter per pixel
  const hash = (x: number, y: number) => {
    let h = (x * 374761393 + y * 668265263) >>> 0;
    h = ((h ^ (h >> 13)) * 1274126177) >>> 0;
    return (h & 0xffff) / 0xffff;
  };

  const rects: string[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Smooth radial: 0.55 at center, 0 at edge
      const gradientValue = Math.max(0, 0.55 * (1 - dist));

      // Mix Bayer structure with noise for a less repetitive pattern
      const bayer = BAYER_8X8[y % 8][x % 8];
      const noise = hash(x, y);
      const threshold = bayer * 0.5 + noise * 0.5;
      if (gradientValue > threshold) {
        rects.push(
          `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`
        );
      }
    }
  }

  const svgDataUri = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${cols}" height="${rows}" viewBox="0 0 ${cols} ${rows}" shape-rendering="crispEdges">${rects.join("")}</svg>`
  )}`;

  return (
    <div
      className={className}
      style={{
        width,
        height,
        backgroundImage: `url("${svgDataUri}")`,
        backgroundSize: `${width}px ${height}px`,
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        maskImage: `radial-gradient(40% 30% at center, black 0.01%, transparent 90%)`,
        WebkitMaskImage: `radial-gradient(40% 30% at center, black 0.01%, transparent 90%)`,
      }}
      aria-hidden="true"
    />
  );
}
