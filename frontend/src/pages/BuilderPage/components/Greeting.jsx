import { motion } from "motion/react";
import { LogoMark } from "@/components";
import { site } from "@/config/site";

const suggestions = [
  "A landing page for my bakery with online orders",
  "A photographer portfolio with a dark gallery",
  "A SaaS homepage with pricing and FAQ",
  "A booking site for a yoga studio",
];

export default function Greeting() {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
      className="mb-8 flex flex-col items-center gap-5 text-center">
      <LogoMark size={44} />
      <h1 className="text-[clamp(1.9rem,4.4vw,3rem)] font-semibold leading-tight tracking-[-.03em]">What will you build today?</h1>
      <p className="max-w-md text-muted">Describe your website and the {site.name} agents will plan, design, code and ship it.</p>
    </motion.div>
  );
}

export function Suggestions({ onPick }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}
      className="mt-5 flex max-w-3xl flex-wrap justify-center gap-2.5">
      {suggestions.map((s) => (
        <button key={s} onClick={() => onPick(s)}
          className="rounded-full border border-line px-4 py-2 text-[.88rem] text-muted transition-colors hover:border-gold hover:text-ink">{s}</button>
      ))}
    </motion.div>
  );
}
