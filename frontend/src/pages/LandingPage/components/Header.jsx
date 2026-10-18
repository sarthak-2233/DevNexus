import { Button, Container, Logo } from "@/components";
import { useAuth } from "@/context/AuthContext";

const links = [["Agents", "#agents"], ["Memory", "#memory"], ["Build", "#build"]];

export default function Header() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/70 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden gap-7 text-[.95rem] text-muted md:flex">
          {links.map(([label, href]) => <a key={label} href={href} className="hover:text-ink">{label}</a>)}
        </nav>
        <div className="flex gap-2.5">
          {!user && <Button to="/login" variant="ghost" size="sm">Log in</Button>}
          <Button to="/builder" size="sm">Start building</Button>
        </div>
      </Container>
    </header>
  );
}
