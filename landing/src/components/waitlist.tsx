import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "./reveal.js";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error("Request failed");
      setState("success");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="py-24 border-t border-edge-subtle">
      <div className="max-w-[1100px] mx-auto px-6 text-center">
        <Reveal>
          <p className="text-xs font-medium text-ink3 uppercase tracking-widest mb-3 font-mono">
            Early access
          </p>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.03em] leading-tight mb-4">
            Get notified when we launch
          </h2>
          <p className="text-ink2 max-w-[420px] mx-auto mb-8 text-[15px] leading-relaxed">
            Join the waitlist and be the first to know when new features ship.
          </p>

          <AnimatePresence mode="wait">
            {state === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 text-sm text-green-600 font-medium font-mono"
              >
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                You're on the list
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex items-center gap-2 justify-center max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "error") setState("idle");
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-mono bg-page border border-edge rounded-lg outline-none focus:border-ink3 transition-colors placeholder:text-ink3/50"
                />
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="px-5 py-2.5 text-sm font-medium bg-btn text-white rounded-lg hover:bg-btn/90 transition-colors disabled:opacity-50"
                >
                  {state === "loading" ? "..." : "Join"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {state === "error" && (
            <p className="text-xs text-red-500 mt-3 font-mono">
              Something went wrong — try again
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
