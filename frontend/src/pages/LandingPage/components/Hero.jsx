import { motion } from "motion/react";
import { Button, Container, GlowBackground } from "@/components";
import AgentGraph from "./AgentGraph";

const lines = ["Describe a site.", "A team of agents ships it."];
const list = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } };
const word = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.2, 0.7, 0.2, 1] } },
};

export default function Hero() {
  return (
    <div className="relative pb-10 pt-10 md:pt-[72px]">
      <GlowBackground />
      <Container className="grid items-center gap-10 md:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-line bg-panel/60 py-1.5 pl-2 pr-3.5 text-[.85rem] text-muted">
            <b className="rounded-full bg-sage px-2.5 text-xs font-semibold text-bg">New</b>
            Agents now share memory through Qdrant
          </motion.div>

          <motion.h1 variants={list} initial="hidden" animate="show"
            className="my-5 text-[clamp(2.5rem,6.2vw,4.9rem)] font-bold leading-[1.02] tracking-[-.04em]">
            {lines.map((l, i) => (
              <span key={i} className={`block ${i ? "text-muted" : ""}`}>
                {l.split(" ").map((w, j) => (
                  <motion.span key={j} variants={word} className="mr-[.25em] inline-block">{w}</motion.span>
                ))}
              </span>
            ))}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.85 }}
            className="mb-7 max-w-[30em] text-[1.15rem] text-muted">
            Dev Nexus plans, designs, codes, reviews and deploys your website with a team of LangChain agents that remember every decision.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1 }}
            className="flex flex-wrap gap-3">
            <Button to="/builder">Start building</Button>
            <Button href="#agents" variant="ghost">Meet the agents</Button>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.4 }}
          className="mx-auto aspect-[520/460] w-full max-w-[560px] md:justify-self-end">
          <AgentGraph />
        </motion.div>
      </Container>
    </div>
  );
}
