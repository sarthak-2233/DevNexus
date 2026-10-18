import { Link } from "react-router-dom";
import { Button, Logo } from "@/components";
import { useAuth } from "@/context/AuthContext";

const nav = ["Projects", "Templates", "Settings"];
const recents = ["Bakery online store", "Photographer portfolio", "SaaS pricing page", "Yoga studio booking"];

export default function Sidebar({ open, onClose, onNew }) {
  const { user, logout } = useAuth();
  const name = user?.name || "You";
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={onClose} aria-hidden />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line bg-bg2 p-4 transition-transform md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-5 px-2 pt-1"><Logo /></div>
        <Button variant="ghost" className="mb-4 w-full !justify-start" onClick={() => { onNew(); onClose(); }}>
          <span className="text-lg leading-none">+</span> New build
        </Button>
        <nav className="grid gap-0.5">
          {nav.map((n) => (
            <button key={n} className="rounded-lg px-3 py-2 text-left text-[.95rem] text-muted transition-colors hover:bg-panel hover:text-ink">{n}</button>
          ))}
        </nav>
        <p className="mb-2 mt-7 px-3 text-xs font-medium uppercase tracking-wider text-muted/70">Recents</p>
        <div className="grid flex-1 content-start gap-0.5 overflow-y-auto">
          {recents.map((r) => (
            <button key={r} className="truncate rounded-lg px-3 py-2 text-left text-[.92rem] text-muted transition-colors hover:bg-panel hover:text-ink">{r}</button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-line px-2 pt-4 text-sm">
          <span className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-panel font-semibold uppercase text-gold">{name[0]}</span>
            <span className="min-w-0"><b className="block truncate font-medium leading-tight">{name}</b><span className="text-xs text-muted">Free plan</span></span>
          </span>
          <span className="flex gap-3 text-muted">
            <Link to="/" className="hover:text-ink">Home</Link>
            <button onClick={logout} className="hover:text-ink">Log out</button>
          </span>
        </div>
      </aside>
    </>
  );
}
