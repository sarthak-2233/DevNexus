export default function Divider({ children }) {
  return (
    <div className="my-[22px] flex items-center gap-3.5 text-[.82rem] text-muted before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">
      {children}
    </div>
  );
}
