import { Container, Reveal, SectionHeading } from "@/components";

const k = (t) => `<span class="text-copper">${t}</span>`;
const s = (t) => `<span class="text-sage">${t}</span>`;
const f = (t) => `<span class="text-gold">${t}</span>`;
const c = (t) => `<span class="text-[#6f6a78]">${t}</span>`;
const CODE = [
  c("# a build graph with shared memory"),
  `${k("from")} langgraph.graph ${k("import")} StateGraph, END`,
  `${k("from")} langchain_qdrant ${k("import")} QdrantVectorStore`,
  "",
  `memory = QdrantVectorStore.${f("from_existing_collection")}(`,
  `    collection_name=${s('"site_memory"')},`,
  "    embedding=embeddings,",
  `    url=${s('"http://localhost:6333"')},`,
  ")",
  "",
  "g = StateGraph(SiteState)",
  `${k("for")} name, fn ${k("in")} agents.items():`,
  `    g.${f("add_node")}(name, fn(memory))`,
  "",
  `g.${f("set_entry_point")}(${s('"planner"')})`,
  `g.${f("add_edge")}(${s('"planner"')}, ${s('"designer"')})`,
  `g.${f("add_edge")}(${s('"designer"')}, ${s('"coder"')})`,
  `g.${f("add_edge")}(${s('"coder"')}, ${s('"reviewer"')})`,
  `g.${f("add_conditional_edges")}(${s('"reviewer"')}, route,`,
  `    {${s('"fix"')}: ${s('"coder"')}, ${s('"ship"')}: ${s('"deployer"')}})`,
  `g.${f("add_edge")}(${s('"deployer"')}, END)`,
].join("\n");

export default function CodeSnippet() {
  return (
    <section id="build" className="pb-[76px] pt-5 md:pb-[110px]">
      <Container className="grid items-center gap-12 md:grid-cols-[.8fr_1.2fr]">
        <SectionHeading title="Wire it up in a few lines."
          subtitle="Agents are LangGraph nodes. Memory is one Qdrant collection every node can read and write." />
        <Reveal y={20}>
          <pre className="overflow-x-auto rounded-[18px] border border-line bg-bg2 p-[26px] font-mono text-[.86rem] leading-[1.75] text-[#d8d2c6]">
            <code dangerouslySetInnerHTML={{ __html: CODE }} />
          </pre>
        </Reveal>
      </Container>
    </section>
  );
}
