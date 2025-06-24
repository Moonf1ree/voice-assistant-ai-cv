"use client";
import { useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { IFaceIDLoaderProps } from "./types";

export function FaceIDLoader({ progress }: IFaceIDLoaderProps) {
  const controls = useAnimation();
  const circleRef = useRef<SVGCircleElement>(null);
  const circumference = 2 * Math.PI * 40;

  useEffect(() => {
    controls.start({
      strokeDashoffset: circumference - (progress / 100) * circumference,
      transition: { duration: 0.5, ease: "easeInOut" },
    });
  }, [progress, controls, circumference]);

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <motion.circle
          ref={circleRef}
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={controls}
          transform="rotate(-90 50 50)"
        />
      </svg>

      <AnimatePresence>
        <motion.div
          className="absolute flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {progress < 100 ? (
            <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse" />
          ) : (
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
