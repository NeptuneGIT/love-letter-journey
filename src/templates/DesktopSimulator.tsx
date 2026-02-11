import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { config } from "@/config";
import { fireConfetti } from "@/lib/confetti";

const errors = [
  { title: "CRUSH_DETECTED.exe", msg: "Fatal Error: Cannot stop thinking about you." },
  { title: "Too_Cute_Error", msg: "Warning: Cuteness levels exceeding safe limits." },
  { title: "Heart_Rate_High.dll", msg: "System Alert: Heart rate anomaly detected near subject." },
  { title: "Butterflies.sys", msg: "Critical: Stomach butterfly overflow. Cannot contain." },
];

const DesktopSimulator = () => {
  const [stage, setStage] = useState(0);
  const [closedErrors, setClosedErrors] = useState<number[]>([]);
  const [bsod, setBsod] = useState(false);
  const [bsodPink, setBsodPink] = useState(false);

  const closeError = (idx: number) => {
    const next = [...closedErrors, idx];
    setClosedErrors(next);
    if (next.length >= errors.length) {
      setBsod(true);
      setTimeout(() => setBsodPink(true), 1500);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "#008080",
        fontFamily: "'Courier New', 'MS Sans Serif', monospace",
      }}
    >
      <Link
        to="/"
        className="fixed left-2 top-2 z-[100] border-2 px-3 py-1 text-xs font-bold"
        style={{
          background: "#c0c0c0",
          borderColor: "#fff #808080 #808080 #fff",
          color: "#000",
        }}
      >
        ← Gallery
      </Link>

      <AnimatePresence mode="wait">
        {/* Stage 0: Intro */}
        {stage === 0 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen flex-col items-center justify-center"
          >
            <div className="mb-8 text-8xl">🖥️</div>
            <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              90s Desktop Simulator
            </h1>
            <p className="mb-8 text-teal-200">A love letter from your operating system</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStage(1)}
              className="border-2 px-8 py-3 text-lg font-bold"
              style={{
                background: "#c0c0c0",
                borderColor: "#fff #808080 #808080 #fff",
                color: "#000",
              }}
            >
              Power On
            </motion.button>
          </motion.div>
        )}

        {/* Stage 1: Login */}
        {stage === 1 && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen items-center justify-center"
            style={{ background: "#000080" }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="border-2 text-center"
              style={{
                background: "#c0c0c0",
                borderColor: "#fff #808080 #808080 #fff",
                minWidth: 320,
              }}
            >
              {/* Title bar */}
              <div
                className="flex items-center px-2 py-1"
                style={{
                  background: "linear-gradient(90deg, #000080, #1084d0)",
                }}
              >
                <span className="text-sm font-bold text-white">Welcome to LoveOS 95</span>
              </div>
              <div className="p-6">
                <div className="mb-4 text-6xl">💻</div>
                <p className="mb-4 text-sm" style={{ color: "#000" }}>
                  Click your name to log in:
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStage(2)}
                  className="border-2 px-6 py-2 font-bold"
                  style={{
                    background: "#c0c0c0",
                    borderColor: "#fff #808080 #808080 #fff",
                    color: "#000",
                  }}
                >
                  👤 {config.recipientName}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Stage 2: Desktop with errors */}
        {stage === 2 && !bsod && (
          <motion.div
            key="desktop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen"
            style={{ background: "#008080" }}
          >
            {/* Desktop icons */}
            <div className="flex flex-wrap gap-6 p-6">
              {config.photos.slice(0, 4).map((photo, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <img
                    src={photo}
                    alt=""
                    className="h-36 w-36 border border-white/30 object-cover"
                  />
                  <span className="text-xs text-white" style={{ textShadow: "1px 1px #000" }}>
                    photo_{i + 1}.bmp
                  </span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-36 w-36 items-center justify-center border border-white/30 bg-white/10 text-4xl">
                  💌
                </div>
                <span className="text-xs text-white" style={{ textShadow: "1px 1px #000" }}>
                  love.txt
                </span>
              </div>
            </div>

            {/* Error popups */}
            {errors.map((err, i) => {
              if (closedErrors.includes(i)) return null;
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.5 }}
                  className="absolute border-2"
                  style={{
                    background: "#c0c0c0",
                    borderColor: "#fff #808080 #808080 #fff",
                    top: `${20 + i * 12}%`,
                    left: `${10 + i * 8}%`,
                    minWidth: 280,
                    zIndex: 10 + i,
                  }}
                >
                  <div
                    className="flex items-center justify-between px-2 py-1"
                    style={{
                      background: "linear-gradient(90deg, #000080, #1084d0)",
                    }}
                  >
                    <span className="text-xs font-bold text-white">{err.title}</span>
                    <button
                      onClick={() => closeError(i)}
                      className="border px-1 text-xs font-bold"
                      style={{
                        background: "#c0c0c0",
                        borderColor: "#fff #808080 #808080 #fff",
                        color: "#000",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex items-start gap-3 p-4">
                    <span className="text-2xl">⚠️</span>
                    <p className="text-sm" style={{ color: "#000" }}>
                      {err.msg}
                    </p>
                  </div>
                  <div className="flex justify-center pb-3">
                    <button
                      onClick={() => closeError(i)}
                      className="border-2 px-6 py-1 text-sm"
                      style={{
                        background: "#c0c0c0",
                        borderColor: "#fff #808080 #808080 #fff",
                        color: "#000",
                      }}
                    >
                      OK
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {/* Taskbar */}
            <div
              className="fixed bottom-0 left-0 right-0 flex items-center border-t-2 px-2 py-1"
              style={{
                background: "#c0c0c0",
                borderColor: "#fff",
              }}
            >
              <div
                className="border-2 px-4 py-1 text-sm font-bold"
                style={{
                  borderColor: "#fff #808080 #808080 #fff",
                  color: "#000",
                }}
              >
                🪟 Start
              </div>
              <span className="ml-auto text-xs" style={{ color: "#000" }}>
                14:02
              </span>
            </div>
          </motion.div>
        )}

        {/* BSOD */}
        {bsod && (
          <motion.div
            key="bsod"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-screen flex-col items-center justify-center p-8 text-center"
            style={{
              background: bsodPink
                ? "linear-gradient(135deg, #ff6b9d, #c44569)"
                : "#000080",
              transition: "background 1s ease",
              fontFamily: "'Courier New', monospace",
            }}
          >
            {!bsodPink ? (
              <motion.div animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 0.5, repeat: 3 }}>
                <p className="text-lg font-bold text-white">
                  A fatal error has occurred in HEART.sys
                </p>
                <p className="mt-2 text-sm text-white/80">
                  Press any key to continue_
                </p>
              </motion.div>
            ) : (
              <>
                {/* Photo mosaic background */}
                <div className="pointer-events-none absolute inset-0 grid grid-cols-4 gap-2 p-4 opacity-10">
                  {config.photos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt=""
                      className="h-full w-full rounded object-cover"
                      style={{ transform: `rotate(${(i % 2 === 0 ? 1 : -1) * (2 + i)}deg)` }}
                    />
                  ))}
                </div>
                
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10">
                  <p className="mb-4 text-sm uppercase tracking-widest text-white/70">
                    System Failure
                  </p>
                  <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
                    I've fallen for you.
                  </h2>
                  <p className="mb-8 text-xl text-white/90">
                    {config.recipientName}, will you be my Valentine?
                  </p>
                  <div className="flex justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fireConfetti()}
                      className="border-2 px-8 py-3 font-bold text-white"
                      style={{
                        borderColor: "#fff",
                        background: "rgba(255,255,255,0.2)",
                      }}
                    >
                      Yes! 💙
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 0.9, opacity: 0.5 }}
                      className="border-2 px-6 py-3 font-bold"
                      style={{
                        borderColor: "rgba(255,255,255,0.3)",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      Ctrl+Z
                    </motion.button>
                  </div>
                  <p className="mt-6 text-sm text-white/50">— {config.senderName}</p>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesktopSimulator;
