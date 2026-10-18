import { useEffect, useRef, useState } from "react";
import { animate } from "motion";
import { useReducedMotion } from "motion/react";
import { agents } from "../data";

const C = { x: 260, y: 230 };

export default function AgentGraph() {
  const paths = useRef([]);
  const dot = useRef(null), halo = useRef(null), ring = useRef(null);
  const [lit, setLit] = useState(-1);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    let alive = true;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const place = (x, y) => [dot.current, halo.current].forEach((n) => { n?.setAttribute("cx", x); n?.setAttribute("cy", y); });
    const show = (on) => { dot.current?.setAttribute("opacity", on ? 1 : 0); halo.current?.setAttribute("opacity", on ? 0.25 : 0); };
    const tween = (d, fn) => animate(0, 1, { duration: d, ease: "easeInOut", onUpdate: fn });

    (async () => {
      await wait(1200);
      while (alive) {
        for (let i = 0; i < 4 && alive; i++) {
          const p = paths.current[i], len = p.getTotalLength();
          setLit(i); show(true);
          await tween(1.1, (v) => { const pt = p.getPointAtLength(len * v); place(pt.x, pt.y); });
          setLit(i + 1); await wait(260);
        }
        if (!alive) break;
        const a = agents[4];
        await tween(0.9, (v) => place(a.x + (C.x - a.x) * v, a.y + (C.y - a.y) * v));
        animate(0, 1, { duration: 1, onUpdate: (v) => { ring.current?.setAttribute("r", 46 + 32 * v); ring.current?.setAttribute("opacity", 0.7 * (1 - v)); } });
        await wait(600); show(false); setLit(-1);
      }
    })();
    return () => { alive = false; };
  }, [reduce]);

  return (
    <svg viewBox="0 0 520 460" className="h-full w-full overflow-visible" role="img"
         aria-label="Five agents passing work to each other around a shared Qdrant memory">
      <defs>
        <radialGradient id="cg"><stop offset="0" stopColor="#e08a6b" stopOpacity=".35" /><stop offset="1" stopColor="#e08a6b" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="260" cy="230" r="120" fill="url(#cg)" />
      {agents.map((a, i) => {
        const b = agents[(i + 1) % 5];
        return (
          <g key={a.n}>
            <path ref={(el) => (paths.current[i] = el)} d={`M${a.x} ${a.y} L${b.x} ${b.y}`} stroke="#2a2832" strokeWidth="1.2" fill="none" />
            <path d={`M${a.x} ${a.y} L260 230`} stroke="#2a2832" strokeWidth="1.2" fill="none" strokeDasharray="3 5" />
          </g>
        );
      })}
      {agents.map((a, i) => (
        <g key={a.n} textAnchor="middle">
          <rect x={a.x - 62} y={a.y - 26} width="124" height="52" rx="14" fill="#15141c"
                stroke={lit === i ? "#d9b878" : "#2a2832"} strokeWidth="1.2" style={{ transition: "stroke .3s" }} />
          <text x={a.x} y={a.y - 3} fill="#f3efe8" fontSize="14" fontWeight="600">{a.n}</text>
          <text x={a.x} y={a.y + 14} fill="#9a95a3" fontSize="10.5" fontFamily="IBM Plex Mono, monospace">{a.s}</text>
        </g>
      ))}
      <circle cx="260" cy="230" r="46" fill="#15141c" stroke="#e08a6b" strokeWidth="1.4" />
      <circle ref={ring} cx="260" cy="230" r="46" fill="none" stroke="#e08a6b" opacity="0" />
      <text x="260" y="228" textAnchor="middle" fill="#f3efe8" fontSize="15" fontWeight="700">Qdrant</text>
      <text x="260" y="245" textAnchor="middle" fill="#9a95a3" fontSize="10" fontFamily="IBM Plex Mono, monospace">shared memory</text>
      <circle ref={halo} r="11" fill="#d9b878" opacity="0" />
      <circle ref={dot} r="5" fill="#d9b878" opacity="0" />
    </svg>
  );
}
