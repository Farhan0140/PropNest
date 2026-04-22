import React from "react";
import { motion } from "framer-motion";

const NotFoundOrError = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f5f7] relative overflow-hidden p-4 font-sans">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: `24px 24px`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 250, damping: 18 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Main Alert Card */}
        <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          {/* Top Accent Bar */}
          <div className="h-5 bg-red-400 border-b-2 border-black" />

          <div className="p-8 text-center">
            {/* Icon Box */}
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-xl bg-yellow-300 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <svg
                className="w-12 h-12 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-black text-black mb-3 tracking-tight uppercase"
            >
              Access Denied
            </motion.h1>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-20 h-1.5 bg-black mx-auto mb-5"
            />

            {/* Message */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-black/80 font-bold text-base leading-relaxed mb-8"
            >
              You don't have permission to access this page. Please contact your
              administrator if you believe this is an error.
            </motion.p>

            {/* Status Badge */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-300 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-8"
            >
              <span className="w-3 h-3 rounded-full bg-red-600 border-2 border-black animate-pulse" />
              <span className="text-xs font-bold text-black tracking-wider uppercase">
                Error 403 · Forbidden
              </span>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-stretch pt-2 border-t-2 border-dashed border-gray-300"
            >
              <button
                type="button"
                onClick={() => window.history.back()}
                className="w-full bg-gray-300 border-2 border-black rounded-lg px-6 py-3 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => (window.location.href = "/")}
                className="w-full bg-yellow-300 border-2 border-black rounded-lg px-6 py-3 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer"
              >
                Home Page
              </button>
            </motion.div>
          </div>
        </div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-black/30 text-xs mt-6 tracking-widest uppercase font-bold"
        >
          Restricted Area
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFoundOrError;