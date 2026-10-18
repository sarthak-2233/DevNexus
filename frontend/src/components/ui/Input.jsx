import { forwardRef, useId } from "react";
import { motion } from "motion/react";

const Input = forwardRef(function Input({ label, error, right, className = "", ...props }, ref) {
  const id = useId();
  return (
    <motion.div className={`mb-4 ${className}`} animate={{ x: error ? [0, -6, 6, -4, 4, 0] : 0 }} transition={{ duration: 0.35 }}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}</label>
      <div className="relative">
        <input id={id} ref={ref} aria-invalid={!!error}
          className={`w-full rounded-xl border bg-bg2 px-3.5 py-3 text-base text-ink outline-none transition placeholder:text-[#625e6b] focus:border-gold focus:ring-[3px] focus:ring-gold/15 ${error ? "border-[#ff8a7a]" : "border-line"} ${right ? "pr-16" : ""}`}
          {...props} />
        {right}
      </div>
      {error && <p role="alert" className="mt-1.5 text-[.82rem] text-[#ff8a7a]">{error}</p>}
    </motion.div>
  );
});
export default Input;
