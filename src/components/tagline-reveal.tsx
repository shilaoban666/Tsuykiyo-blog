"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function TaglineReveal({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const chars = lines.flatMap((line, lineIndex) =>
    [...line].map((char, charIndex) => ({ char, key: `${lineIndex}-${charIndex}`, lineIndex })),
  );

  return (
    <div ref={ref} className="mx-auto max-w-5xl px-5 py-24 sm:px-6 sm:py-32">
      <motion.p
        className="eyebrow mb-8 flex items-center gap-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <span className="h-px w-10 bg-accent" /> A note to myself
      </motion.p>
      <p className="font-serif-cn text-[clamp(2rem,4.6vw,4.3rem)] font-medium leading-[1.35] tracking-tight">
        {chars.map(({ char, key, lineIndex }, index) => (
          <motion.span
            key={key}
            className="inline-block"
            style={{ whiteSpace: char === " " ? "pre" : undefined }}
            initial={{ opacity: 0.16 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            transition={{ duration: 0.7, delay: index * 0.028, ease: [0.22, 1, 0.36, 1] }}
          >
            {char}
            {lineIndex < lines.length - 1 && index === lines.slice(0, lineIndex + 1).join("").length - 1 ? <br /> : null}
          </motion.span>
        ))}
      </p>
    </div>
  );
}