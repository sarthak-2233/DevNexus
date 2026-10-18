export default function GlowBackground({ position = "top" }) {
  const pos = position === "top" ? "top-[-10%]" : "bottom-[-30%]";
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-[-10%] -z-10 h-[720px] ${pos} bg-[radial-gradient(520px_320px_at_20%_10%,rgba(217,184,120,.16),transparent_70%),radial-gradient(480px_300px_at_85%_30%,rgba(224,138,107,.12),transparent_70%)]`} />
  );
}
