import { useState } from "react";
import { motion } from "motion/react";
import { Container, SectionHeading } from "@/components";
import { logs } from "../data";

const tone = { g: "text-sage", r: "text-copper" };

export default function Agents() {
  const [i, setI] = useState(0);
  const cur = logs[i];
  return (
    <section id="agents" className="py-[76px] md:py-[110px]">
      <Container>
        <SectionHeading className="mb-11" title="Five specialists. One finished site."
          subtitle="Each agent owns one job and hands off to the next. Pick one to watch its part of a build." />
        <div className="grid gap-7 md:grid-cols-[320px_1fr]">
          <div role="tablist" className="flex gap-1.5 overflow-x-auto pb-1.5 md:flex-col md:overflow-visible">
            {logs.map((d, j) => (
              <button key={d.n} role="tab" aria-selected={i === j} onClick={() => setI(j)}
                className={`min-w-[190px] rounded-2xl border p-4 text-left transition-colors md:min-w-0 ${
                  i === j ? "border-line bg-panel text-ink" : "border-transparent text-muted hover:text-ink"}`}>
                <strong className="block text-[1.1rem] font-semibold text-ink">{d.n}</strong>
                <span className="text-[.92rem]">{d.r}</span>
              </button>
            ))}
          </div>
          <div role="tabpanel" className="flex min-h-[340px] flex-col overflow-hidden rounded-[18px] border border-line bg-bg2">
            <div className="flex items-center gap-2 border-b border-line bg-panel px-[18px] py-3.5 font-mono text-[.8rem] text-muted">
              <i className="h-2.5 w-2.5 rounded-full bg-line" /><i className="h-2.5 w-2.5 rounded-full bg-line" /><i className="h-2.5 w-2.5 rounded-full bg-line" />
              <em className="ml-auto not-italic">{cur.n.toLowerCase()}.log</em>
            </div>
            <div key={i} className="flex-1 p-[22px] font-mono text-[.88rem] leading-[1.9] text-muted">
              {cur.l.map(([k, tag, text], n) => (
                <motion.div key={n} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: n * 0.28 }}>
                  <b className="font-medium text-gold">{tag}</b> <span className={tone[k]}>{text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
