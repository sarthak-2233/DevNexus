import { motion } from "motion/react";
import { Button, LogoMark } from "@/components";
import { site } from "@/config/site";
import AgentSteps from "./AgentSteps";

export default function ChatMessage({ message }) {
  if (message.role === "user") {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
        <p className="max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-br-lg bg-panel px-5 py-3 text-ink">{message.text}</p>
      </motion.div>
    );
  }
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4">
      <div className="flex items-center gap-2.5 text-sm font-semibold"><LogoMark size={22} />{site.name} agents</div>
      <AgentSteps steps={message.steps} />
      {message.error && <p className="text-copper">{message.error}</p>}
      {message.done && message.result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/10 to-copper/5 p-5">
          <p className="mb-1 text-sm text-sage">Build complete</p>
          <h3 className="mb-1 text-lg font-semibold">{message.result.title}</h3>
          <p className="mb-4 text-[.95rem] text-muted">{message.result.pages} pages generated, reviewed and packaged.</p>
          <div className="flex flex-wrap gap-2.5">
            <Button size="sm">Preview site</Button>
            <Button size="sm" variant="ghost">Download code</Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
