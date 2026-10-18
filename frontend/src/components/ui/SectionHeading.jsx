export default function SectionHeading({ title, subtitle, center = false, className = "" }) {
  const mx = center ? "mx-auto" : "";
  return (
    <div className={`${center ? "text-center" : ""} ${className}`}>
      <h2 className={`mb-4 max-w-[16em] text-[clamp(2rem,4.2vw,3.2rem)] font-bold leading-[1.08] tracking-[-.035em] ${mx}`}>{title}</h2>
      {subtitle && <p className={`max-w-[34em] text-[1.1rem] text-muted ${mx}`}>{subtitle}</p>}
    </div>
  );
}
