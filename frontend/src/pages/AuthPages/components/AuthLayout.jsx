import { motion } from "motion/react";
import { Logo } from "@/components";
import ShowcasePanel from "./ShowcasePanel";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen md:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]">
      <main className="flex flex-col px-[clamp(22px,5vw,64px)] pb-10 pt-7">
        <Logo className="!p-0" />
        <div className="flex flex-1 items-start justify-center py-9 md:items-center">
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-[400px]">
            <h1 className="mb-2.5 text-[clamp(1.9rem,3.6vw,2.4rem)] font-bold leading-[1.1] tracking-[-.035em]">{title}</h1>
            <p className="mb-6 text-muted">{subtitle}</p>
            {children}
            <p className="mt-[22px] text-center text-[.92rem] text-muted">{footer}</p>
          </motion.div>
        </div>
      </main>
      <ShowcasePanel />
    </div>
  );
}
