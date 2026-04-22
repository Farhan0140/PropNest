import React from 'react';
import { motion } from "framer-motion";

const LoadingAnimation = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f4f5f7] relative overflow-hidden font-sans">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: `24px 24px`,
        }}
      />

      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Infinity Animation Container */}
        <div className="relative flex items-center justify-center h-16 w-24">
          {[0, 0.6].map((delay) => (
            <motion.div
              key={`inf-${delay}`}
              className="absolute w-5 h-5 rounded-full bg-orange-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              animate={{
                x: [-28, 0, 28, 0, -28],
                y: [-10, 0, -10, 0, -10],
                scale: [0.75, 1.15, 0.75, 1.15, 0.75],
              }}
              transition={{ repeat: Infinity, duration: 2, delay, ease: "easeInOut" }}
            />
          ))}
        </div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg font-black text-black uppercase tracking-widest"
        >
          Loading Data...
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingAnimation;