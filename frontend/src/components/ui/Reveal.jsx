import { motion } from "motion/react";

/** Fades and lifts its children in once they scroll into view. */
export default function Reveal({ delay = 0, y = 24, className = "", children }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, delay }}>
      {children}
    </motion.div>
  );
}
