import { useEffect, useState } from "react";
import { motion } from "motion/react";

const steps = [["Planner", "scope pages"], ["Designer", "set the look"], ["Coder", "write pages"], ["Reviewer", "audit and fix"], ["Deployer", "go live"]];

export default function ShowcasePanel() {
  const [idx, setIdx] = useState(0); // steps before idx are done, idx is running

  useEffect(() => {
    const t = setTimeout(() => setIdx((i) => (i >= steps.length ? 0 : i + 1)), idx === steps.length ? 2200 : 1000);
    return () => clearTimeout(t);
  }, [idx]);

  return (
    <aside aria-hidden="true" className="relative hidden flex-col justify-center overflow-hidden border-l border-line bg-bg2 px-[clamp(28px,5vw,72px)] py-14 md:flex">
      <motion.div className="pointer-events-none absolute -right-20 -top-24 h-[380px] w-[380px] rounded-full bg-gold/20 blur-[70px]"
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="pointer-events-none absolute -bottom-20 -left-16 h-[320px] w-[320px] rounded-full bg-copper/15 blur-[70px]"
        animate={{ x: [0, 50, 0], y: [0, -30, 0] }} transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }} />

      <motion.div className="relative max-w-[460px] rounded-[20px] border border-line bg-panel/85 p-[22px] backdrop-blur"
        animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <div className="mb-[18px] flex items-center justify-between font-mono text-[.8rem] text-muted">
          <span>build #128 · bakery-site</span>
          <b className="font-medium text-sage">{idx === steps.length ? "live" : "running"}</b>
        </div>
        <ul className="grid gap-3.5">
          {steps.map(([n, d], i) => {
            const done = i < idx, run = i === idx;
            return (
              <li key={n} className={`flex items-center gap-3 transition-colors ${done || run ? "text-ink" : "text-muted"}`}>
                <span className={`grid h-5 w-5 flex-none place-items-center rounded-full border transition ${
                  done ? "border-sage bg-sage" : run ? "animate-spin border-2 border-gold border-t-transparent" : "border-line"}`}>
                  {done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0b0a0f" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>}
                </span>
                {n}
                <em className="ml-auto font-mono text-[.78rem] not-italic text-muted">{d}</em>
              </li>
            );
          })}
        </ul>
      </motion.div>

      <div className="relative mt-10 max-w-[460px]">
        <h2 className="mb-3 text-[clamp(1.6rem,2.6vw,2.2rem)] font-bold leading-[1.15] tracking-[-.03em]">From one sentence to a live site.</h2>
        <p className="text-muted">Specialized agents plan, design, code and review, and remember every decision through Qdrant.</p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {["LangChain", "LangGraph", "Qdrant"].map((c) => (
            <span key={c} className="rounded-full border border-line bg-panel/70 px-3.5 py-1.5 text-[.82rem] text-muted">{c}</span>
          ))}
        </div>
      </div>
    </aside>
  );
}
