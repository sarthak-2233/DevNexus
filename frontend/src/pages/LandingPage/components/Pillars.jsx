import { Container, Reveal } from "@/components";

const pillars = [
  ["Reviewed before shipped", "A Reviewer agent checks accessibility, performance and broken links, then sends fixes back to the Coder."],
  ["Any model, any provider", "Assign a different model to each agent through LangChain. Swap one without touching the rest."],
  ["Code you own", "Dev Nexus exports a clean React or static project to your repo. No lock-in, no runtime to keep."],
];

export default function Pillars() {
  return (
    <section className="pb-[76px] pt-5 md:pb-[110px]">
      <Container className="grid border-t border-line md:grid-cols-3">
        {pillars.map(([t, p], i) => (
          <Reveal key={t} delay={i * 0.12}
            className={`border-b border-line py-[26px] md:border-b-0 md:pb-2.5 md:pt-[34px] ${i ? "md:border-l md:pl-8" : ""} ${i < 2 ? "md:pr-8" : ""}`}>
            <h3 className="mb-2.5 text-[1.35rem] font-semibold tracking-tight">{t}</h3>
            <p className="text-muted">{p}</p>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
