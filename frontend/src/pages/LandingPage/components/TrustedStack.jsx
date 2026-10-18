import { Container } from "@/components";

const stack = ["LangChain", "LangGraph", "Qdrant", "FastAPI", "React"];

export default function TrustedStack() {
  return (
    <div className="mt-14 border-y border-line py-[34px]">
      <Container className="flex flex-wrap items-center justify-between gap-x-11 gap-y-3.5 font-semibold text-muted">
        <span className="text-[.95rem] font-normal">Built on</span>
        {stack.map((s) => <span key={s}>{s}</span>)}
      </Container>
    </div>
  );
}
