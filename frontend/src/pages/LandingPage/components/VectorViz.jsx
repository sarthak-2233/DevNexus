import { useEffect, useMemo, useRef, useState } from "react";
import { animate } from "motion";
import { useInView, useReducedMotion } from "motion/react";

const QX = 250, QY = 200, R = 95;

export default function VectorViz() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [r, setR] = useState(0);

  const pts = useMemo(() => {
    let s = 7;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    return Array.from({ length: 70 }, () => {
      const x = 30 + rnd() * 420, y = 30 + rnd() * 340;
      return { x, y, d: Math.hypot(x - QX, y - QY) };
    });
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (reduce) { setR(R); return; }
    const c = animate(0, R, { duration: 1.4, ease: "easeOut", onUpdate: setR });
    return () => c.stop();
  }, [inView, reduce]);

  return (
    <svg ref={ref} viewBox="0 0 480 400" role="img" aria-label="A query finds its nearest neighbours among stored design decisions"
         className="h-auto w-full rounded-[22px] border border-line bg-bg2">
      {pts.map((p, i) => {
        const hit = p.d < r;
        return <circle key={i} cx={p.x} cy={p.y} r={hit ? 5 : 3.4} fill={hit ? "#d9b878" : "#3d3a48"} />;
      })}
      <circle cx={QX} cy={QY} r={r} fill="rgba(224,138,107,.06)" stroke="#e08a6b" strokeDasharray="4 4" />
      <circle cx={QX} cy={QY} r="7" fill="#e08a6b" />
      <text x={QX + 14} y={QY - 12} fill="#f3efe8" fontSize="13" fontFamily="IBM Plex Mono, monospace">query: "dark hero"</text>
    </svg>
  );
}
