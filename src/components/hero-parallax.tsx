"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * 首屏插画的两层视差：
 * - 滚动：画面慢半拍下沉并轻微淡出
 * - 指针：画面朝指针反方向轻移，像隔着一层玻璃看夜景
 */
export function HeroParallax({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.35]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 50, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 50, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (event: PointerEvent) => {
      if (window.scrollY > window.innerHeight) return;
      px.set((event.clientX / window.innerWidth - 0.5) * -22);
      py.set((event.clientY / window.innerHeight - 0.5) * -14);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, px, py]);

  return (
    <div ref={ref} className={className}>
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y, opacity }}>
        <motion.div className="absolute -inset-4" style={reduced ? undefined : { x: sx, y: sy }}>
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
