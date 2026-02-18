import { bootstrap } from "@designtools/core/cli";
import { startStudioServer } from "./server/index.js";

bootstrap({
  name: "Design Engineer Studio",
  defaultTargetPort: 3000,
  defaultToolPort: 4400,
}).then((result) => {
  startStudioServer(result).catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
});
