import { bootstrap } from "@designtools/core/cli";
import { startShadowsServer } from "./server/index.js";

bootstrap({
  name: "Design Tools — Shadows",
  defaultTargetPort: 3000,
  defaultToolPort: 4410,
  extraChecks: async (framework) => {
    const lines = [];
    if (framework.cssFiles.length > 0) {
      lines.push({
        status: "ok" as const,
        label: "Shadows",
        detail: "Will scan CSS files for shadow definitions",
      });
    }
    return lines;
  },
}).then((result) => {
  startShadowsServer(result).catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
});
