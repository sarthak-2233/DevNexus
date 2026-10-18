import { useEffect, useRef, useState } from "react";
import { GlowBackground } from "@/components";
import Sidebar from "./components/Sidebar";
import Greeting, { Suggestions } from "./components/Greeting";
import PromptBox from "./components/PromptBox";
import ChatMessage from "./components/ChatMessage";
import useBuildSession from "./hooks/useBuildSession";

export default function BuilderPage() {
  const [draft, setDraft] = useState("");
  const [sidebar, setSidebar] = useState(false);
  const { messages, busy, send, reset } = useBuildSession();
  const endRef = useRef(null);
  const empty = messages.length === 0;

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages]);

  const submit = () => {
    if (!draft.trim() || busy) return;
    send(draft);
    setDraft("");
  };
  const prompt = <PromptBox value={draft} onChange={setDraft} onSubmit={submit} busy={busy} />;

  return (
    <div className="flex h-[100dvh]">
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} onNew={reset} />
      <div className="relative isolate flex min-w-0 flex-1 flex-col overflow-hidden">
        <GlowBackground />
        <div className="flex h-14 items-center gap-3 px-4 md:hidden">
          <button onClick={() => setSidebar(true)} aria-label="Open menu" className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <span className="font-semibold">New build</span>
        </div>

        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-5 pb-16">
            <Greeting />
            <div className="w-full max-w-3xl">{prompt}</div>
            <Suggestions onPick={setDraft} />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto grid w-full max-w-3xl gap-8 px-5 py-8">
                {messages.map((m) => <ChatMessage key={m.id} message={m} />)}
                <div ref={endRef} />
              </div>
            </div>
            <div className="px-4 pb-5 pt-2"><div className="mx-auto max-w-3xl">{prompt}</div></div>
          </>
        )}
      </div>
    </div>
  );
}
