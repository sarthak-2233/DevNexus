import { useCallback, useState } from "react";
import { pipeline } from "@/config/pipeline";
import { runBuild } from "@/services/buildApi";

let counter = 0;

/** Holds the chat thread and runs builds through the agent pipeline. */
export default function useBuildSession() {
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);

  const send = useCallback(async (prompt) => {
    const text = prompt.trim();
    if (!text || busy) return;
    const aid = `a${++counter}`;
    setMessages((m) => [
      ...m,
      { id: `u${++counter}`, role: "user", text },
      { id: aid, role: "assistant", done: false, steps: pipeline.map((p) => ({ ...p, status: "pending" })) },
    ]);
    setBusy(true);
    const patch = (fn) => setMessages((m) => m.map((x) => (x.id === aid ? fn(x) : x)));
    try {
      const result = await runBuild(text, {
        onStep: (i, status) => patch((x) => ({ ...x, steps: x.steps.map((s, j) => (j === i ? { ...s, status } : s)) })),
      });
      patch((x) => ({ ...x, done: true, result }));
    } catch {
      patch((x) => ({ ...x, done: true, error: "Something went wrong. Please try again." }));
    } finally {
      setBusy(false);
    }
  }, [busy]);

  const reset = useCallback(() => setMessages([]), []);
  return { messages, busy, send, reset };
}
