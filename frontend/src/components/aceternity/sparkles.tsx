"use client";
import { useId, useEffect, useState } from "react";
import Particles from "@tsparticles/react";
import { tsParticles } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "../../lib/utils";
import type { Container } from "@tsparticles/engine";

export const SparklesCore = (props: {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
}) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;
  const [init, setInit] = useState(false);
  useEffect(() => {
    loadSlim(tsParticles).then(() => {
      setInit(true);
    });
  }, []);
  const particlesLoaded = async (_container?: Container) => {
    // optional initialization logic
  };

  const defaultId = useId();

  return (
    init && (
      <Particles
        id={id || defaultId}
        className={cn("h-full w-full", className)}
        particlesLoaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: background || "transparent",
            },
          },
          fullScreen: {
            enable: false,
            zIndex: 1,
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: false,
                mode: "repulse",
              },
              resize: {
                enable: true,
                delay: 0.5,
              },
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: particleColor || "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: false,
              opacity: 0.4,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "out",
              },
              random: false,
              speed: speed || 0.5,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                width: 400,
                height: 400,
              },
              value: particleDensity || 120,
            },
            opacity: {
              value: {
                min: 0.1,
                max: 1,
              },
              animation: {
                enable: true,
                speed: speed || 4,
                sync: false,
              },
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: minSize || 1, max: maxSize || 3 },
            },
          },
          detectRetina: true,
        }}
      />
    )
  );
};
