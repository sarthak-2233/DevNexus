import { Button, Container, GlowBackground, SectionHeading } from "@/components";

export default function CallToAction() {
  return (
    <div id="start" className="relative overflow-hidden border-t border-line py-[120px] text-center">
      <GlowBackground position="bottom" />
      <Container>
        <SectionHeading center title="Describe your site. Watch it get built."
          subtitle="Start with one sentence. The agents handle the plan, the pixels and the deploy." />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/builder">Start building free</Button>
          <Button href="#" variant="ghost">Read the docs</Button>
        </div>
      </Container>
    </div>
  );
}
