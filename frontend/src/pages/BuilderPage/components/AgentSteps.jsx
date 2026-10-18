import { motion } from "motion/react";

function Icon({ status }) {
  if (status === "done")
    return (
      <motion.span initial={{ scale: 0.4 }} animate={{ scale: 1 }} className="grid h-5 w-5 place-items-center rounded-full bg-sage text-bg">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>
      </motion.span>
    );
  if (status === "running") return <span className="h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-transparent" />;
  return <span className="h-5 w-5 rounded-full border border-line" />;
}

export default function AgentSteps({ steps }) {
  return (
    <ol className="grid gap-3.5 rounded-2xl border border-line bg-panel/60 p-5">
      {steps.map((s, i) => (
        <motion.li key={s.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
          className="flex items-center gap-3.5">
          <Icon status={s.status} />
          <span className={s.status === "pending" ? "text-muted/60" : "text-ink"}>
            <b className="font-semibold">{s.name}</b>
            <span className="ml-2 text-[.9rem] text-muted">{s.role}</span>
          </span>
        </motion.li>
      ))}
    </ol>
  );
}
