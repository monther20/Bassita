"use client";

import Particles from "@tsparticles/react";
import { tsParticles } from "@tsparticles/engine";
import { loadBasic } from "@tsparticles/basic";
import { loadExternalPushInteraction } from "@tsparticles/interaction-external-push";
import { loadExternalRepulseInteraction } from "@tsparticles/interaction-external-repulse";
import { loadOpacityUpdater } from "@tsparticles/updater-opacity";
import { useCallback, useEffect } from "react";
import type { Container } from "@tsparticles/engine";

export default function AnimatedBackground() {
  const particlesLoaded = useCallback(async (container?: Container) => {
    console.log("tsparticles loaded", container);
  }, []);

  useEffect(() => {
    const initParticles = async () => {
      await loadBasic(tsParticles);
      await loadExternalPushInteraction(tsParticles);
      await loadExternalRepulseInteraction(tsParticles);
      await loadOpacityUpdater(tsParticles);
    };
    initParticles();
  }, []);

  return (
    <div className="relative flex justify-center items-center z-0">
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={{
          fpsLimit: 60,
          fullScreen: { enable: true, zIndex: -1 },
          background: { color: "transparent" },
          interactivity: {},
          particles: {
            color: {
              value: [
                "#7c3aed",
                "#ec4899",
                "#3b82f6",
                "#10b981",
                "#f59e0b",
                "#4effa5",
              ],
            },
            move: {
              direction: "none",
              enable: true,
              outModes: "out",
              random: false,
              speed: 0.5,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                width: 800,
                height: 600,
              },
              value: 80,
            },
            opacity: {
              value: 0.8,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
}
