export default function Checkbox({ children, error, className = "", ...props }) {
  return (
    <div className={className}>
      <label className="flex cursor-pointer items-start gap-2.5 text-[.88rem] text-muted">
        <input type="checkbox" className="mt-1 h-4 w-4 flex-none accent-[#d9b878]" {...props} />
        <span>{children}</span>
      </label>
      {error && <p role="alert" className="mt-1.5 text-[.82rem] text-[#ff8a7a]">{error}</p>}
    </div>
  );
}
