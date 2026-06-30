import type { ReactNode } from "react";
import { motion } from "motion/react";
import { AlarmClock } from "pixelarticons/react/AlarmClock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from "./cascade-tooltip.js";

/**
 * Wraps a disabled control in a "Coming soon" tooltip with a ringing
 * pixel-art alarm clock. Self-contained — brings its own TooltipProvider.
 */
export function ComingSoon({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          sideOffset={8}
          className="flex items-center gap-1.5 font-mono"
        >
          <motion.span
            className="inline-flex text-yellow-300"
            animate={{ rotate: [0, -16, 16, -16, 16, -9, 9, 0] }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: "easeInOut",
            }}
          >
            <AlarmClock width={13} height={13} />
          </motion.span>
          Coming soon
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
