import { Container } from "@/components";
import { site } from "@/config/site";

export default function Footer() {
  return (
    <footer className="border-t border-line pb-[50px] pt-[30px] text-[.9rem] text-muted">
      <Container className="flex flex-wrap justify-between gap-3">
        <span>© 2026 {site.name}</span>
        <span>Built with LangChain, LangGraph and Qdrant</span>
      </Container>
    </footer>
  );
}
