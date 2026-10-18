import { Link } from "react-router-dom";
import { site } from "@/config/site";

export function LogoMark({ size = 22 }) {
  return (
    <i className="block rounded-[7px] bg-[conic-gradient(from_200deg,#d9b878,#e08a6b,#d9b878)]"
       style={{ width: size, height: size, borderRadius: size * 0.32 }} />
  );
}

export default function Logo({ className = "" }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 text-lg font-bold tracking-tight ${className}`}>
      <LogoMark />{site.name}
    </Link>
  );
}
