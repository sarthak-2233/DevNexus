import { Link } from "react-router-dom";

const base = "inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-[.95rem] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";
const variants = {
  primary: "border-gold bg-gradient-to-br from-[#f0dba8] to-[#c99f5a] text-bg hover:brightness-110",
  ghost: "border-line text-ink hover:border-gold",
  subtle: "border-transparent text-muted hover:text-ink",
};

/** Renders a router Link (`to`), an anchor (`href`) or a button. */
export default function Button({ to, href, variant = "primary", size = "md", className = "", children, ...rest }) {
  const cls = `${base} ${variants[variant]} ${size === "sm" ? "!px-4 !py-2" : ""} ${className}`;
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>;
  return <button className={cls} {...rest}>{children}</button>;
}
