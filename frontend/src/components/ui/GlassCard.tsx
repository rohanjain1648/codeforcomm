import React, { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { cn } from "../../lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glareColor?: string;
}

export function GlassCard({
  children,
  className,
  glareColor = "rgba(255, 255, 255, 0.15)",
  ...props
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useSpring(useMotionValue(0), { stiffness: 400, damping: 40 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 400, damping: 40 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;

    x.set(mouseXPos);
    y.set(mouseYPos);

    const rotateXValue = ((mouseYPos - height / 2) / height) * -15;
    const rotateYValue = ((mouseXPos - width / 2) / width) * 15;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      className={cn(
        "group relative overflow-hidden rounded-[24px] glass-card transition-all duration-300 hover:border-[var(--border-hover)]",
        className
      )}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              ${glareColor},
              transparent 40%
            )
          `,
        }}
      />
      <div className="relative h-full z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
}
