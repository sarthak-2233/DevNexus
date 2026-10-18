import { Container, SectionHeading } from "@/components";
import VectorViz from "./VectorViz";

const facts = [
  ["Consistent output.", "The Coder reuses the Designer's tokens instead of inventing new ones."],
  ["Faster revisions.", 'Ask for "the earlier hero, but darker" and the Planner finds it.'],
  ["Your data stays yours.", "Run Qdrant locally or in your own cloud."],
];

export default function Memory() {
  return (
    <section id="memory" className="pb-[76px] pt-5 md:pb-[110px]">
      <Container className="grid items-center gap-14 md:grid-cols-2">
        <VectorViz />
        <div>
          <SectionHeading title="Agents that never forget a decision."
            subtitle="Every brand rule, component and past fix is stored as a vector in Qdrant. Before an agent acts, it searches for what the team already decided." />
          <ul className="mt-6 grid gap-3.5">
            {facts.map(([b, t]) => (
              <li key={b} className="relative pl-[22px] text-muted before:absolute before:left-0 before:top-[.7em] before:h-2 before:w-2 before:rounded-full before:bg-copper">
                <b className="font-semibold text-ink">{b}</b> {t}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
