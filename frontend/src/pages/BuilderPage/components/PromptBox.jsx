import { useEffect, useRef } from "react";

export default function PromptBox({ value, onChange, onSubmit, busy, placeholder = "Describe the website you want to build…" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  useEffect(() => { ref.current?.focus(); }, []);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(); }
  };
  const canSend = value.trim() && !busy;

  return (
    <div className="rounded-3xl border border-line bg-panel p-3 shadow-[0_10px_40px_-12px_rgba(0,0,0,.6)] transition-colors focus-within:border-gold/60">
      <textarea ref={ref} rows={1} value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={onKeyDown}
        placeholder={placeholder} aria-label="Describe your website"
        className="block max-h-[200px] w-full resize-none bg-transparent px-2 py-1.5 text-[1.02rem] text-ink outline-none placeholder:text-muted/70" />
      <div className="mt-2 flex items-center gap-2">
        <button type="button" aria-label="Attach a file" className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-gold hover:text-ink">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </button>
        <span className="rounded-full border border-line px-3 py-1.5 text-xs text-muted">Multi-agent mode</span>
        <button type="button" onClick={onSubmit} disabled={!canSend} aria-label="Send"
          className="ml-auto grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#f0dba8] to-[#c99f5a] text-bg transition hover:brightness-110 disabled:opacity-30">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
