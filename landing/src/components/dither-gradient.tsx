/**
 * Bayer 8×8 ordered dither gradient.
 * Renders a solid color that dissolves into transparency
 * using a proper Bayer matrix — each "pixel" is `pixelSize` CSS pixels.
 */

// Bayer 8×8 threshold matrix (normalized 0–1)
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

interface DitherGradientProps {
  /** Direction the gradient dissolves toward */
  direction?: "down" | "up";
  /** Height of the gradient band in px */
  height?: number;
  /** Size of each dither "pixel" in CSS px */
  pixelSize?: number;
  /** Color of the solid side */
  color?: string;
  className?: string;
}

export function DitherGradient({
  direction = "down",
  height = 192,
  pixelSize = 4,
  color = "#09090b",
  className = "",
}: DitherGradientProps) {
  const rows = Math.ceil(height / pixelSize);
  const cols = 8; // Bayer matrix width — tiles horizontally via repeat

  // Build an SVG where each cell is filled only if the gradient
  // value at that row exceeds the Bayer threshold
  const rects: string[] = [];
  for (let y = 0; y < rows; y++) {
    // Gradient value: 1 at the solid side, 0 at the dissolve side
    const gradientValue = direction === "down"
      ? 1 - (y / rows)
      : y / rows;

    for (let x = 0; x < cols; x++) {
      const threshold = BAYER_8X8[y % 8][x % 8];
      if (gradientValue > threshold) {
        rects.push(
          `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`
        );
      }
    }
  }

  const svgWidth = cols;
  const svgHeight = rows;

  const svgDataUri = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" shape-rendering="crispEdges">${rects.join("")}</svg>`
  )}`;

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height,
        backgroundImage: `url("${svgDataUri}")`,
        backgroundSize: `${cols * pixelSize}px ${rows * pixelSize}px`,
        backgroundRepeat: "repeat-x",
        imageRendering: "pixelated",
      }}
      aria-hidden="true"
    />
  );
}
