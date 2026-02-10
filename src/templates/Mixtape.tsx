import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { config } from "@/config";
import { fireConfetti } from "@/lib/confetti";

const Mixtape = () => {
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [lyricIndex, setLyricIndex] = useState(0);
  const [showHidden, setShowHidden] = useState(false);

  const lyrics = config.message.split(/[.!?]+/).filter(Boolean).map((s) => s.trim());

  useEffect(() => {
    if (!playing || stage !== 2) return;
    if (lyricIndex >= lyrics.length) {
      setTimeout(() => setStage(3), 1000);
      return;
    }
    const timer = setTimeout(() => setLyricIndex((i) => i + 1), 2500);
    return () => clearTimeout(timer);
  }, [playing, lyricIndex, lyrics.length, stage]);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #1a0a00 0%, #2d1810 30%, #1a0a00 100%)",
        fontFamily: "'Courier New', monospace",
      }}
    >
      <Link
        to="/"
        className="fixed left-4 top-4 z-50 rounded-full px-4 py-2 text-sm font-medium shadow backdrop-blur transition hover:bg-orange-900/50"
        style={{ background: "rgba(251,146,60,0.2)", color: "#fb923c" }}
      >
        ← Gallery
      </Link>

      {/* Warm noise texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      <AnimatePresence mode="wait">
        {/* Stage 0: Intro */}
        {stage === 0 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen flex-col items-center justify-center px-4"
          >
            <motion.div
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="mb-8 text-8xl"
            >
              📼
            </motion.div>
            <h1 className="mb-4 text-center text-3xl font-bold sm:text-4xl" style={{ color: "#fb923c" }}>
              The Mixtape
            </h1>
            <p className="mb-8 text-center" style={{ color: "#d97706" }}>
              A retro mixtape made just for you
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStage(1)}
              className="rounded-lg px-8 py-3 text-lg font-semibold shadow-lg"
              style={{
                background: "linear-gradient(135deg, #fb923c, #f59e0b)",
                color: "#1a0a00",
              }}
            >
              Play ▶
            </motion.button>
          </motion.div>
        )}

        {/* Stage 1: Cassette */}
        {stage === 1 && (
          <motion.div
            key="cassette"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen flex-col items-center justify-center px-4"
          >
            {/* Cassette body */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative mb-8 rounded-xl border-2 p-8 sm:p-12"
              style={{
                background: "linear-gradient(180deg, #3d2817, #2a1a0e)",
                borderColor: "#5c3a1e",
                minWidth: 280,
              }}
            >
              <div
                className="mb-4 rounded px-3 py-1 text-center text-xs font-bold uppercase tracking-widest"
                style={{ background: "#fbbf24", color: "#1a0a00" }}
              >
                Side A
              </div>
              <div className="mb-6 text-center text-lg font-bold" style={{ color: "#fbbf24" }}>
                For {config.recipientName}
              </div>
              {/* Tape reels */}
              <div className="flex items-center justify-center gap-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="flex h-16 w-16 items-center justify-center rounded-full border-4"
                  style={{ borderColor: "#5c3a1e", background: "#1a0a00" }}
                >
                  <div className="h-4 w-4 rounded-full" style={{ background: "#5c3a1e" }} />
                </motion.div>
                <div className="h-2 flex-1 rounded" style={{ background: "#5c3a1e" }} />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="flex h-16 w-16 items-center justify-center rounded-full border-4"
                  style={{ borderColor: "#5c3a1e", background: "#1a0a00" }}
                >
                  <div className="h-4 w-4 rounded-full" style={{ background: "#5c3a1e" }} />
                </motion.div>
              </div>
              <div className="mt-4 text-center text-xs" style={{ color: "#8b6540" }}>
                From {config.senderName} with ♥
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStage(2)}
              className="rounded-lg px-8 py-3 text-lg font-semibold"
              style={{
                background: "linear-gradient(135deg, #fb923c, #f59e0b)",
                color: "#1a0a00",
              }}
            >
              Insert Tape 📼
            </motion.button>
          </motion.div>
        )}

        {/* Stage 2: Visualizer */}
        {stage === 2 && (
          <motion.div
            key="visualizer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen flex-col items-center justify-center px-4"
          >
            <div className="w-full max-w-md">
              <div
                className="mb-6 rounded-xl p-6"
                style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)" }}
              >
                <div className="mb-4 text-center text-sm uppercase tracking-widest" style={{ color: "#d97706" }}>
                  Now Playing
                </div>

                {/* Visualizer bars */}
                <div className="mb-6 flex h-24 items-end justify-center gap-1">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 rounded-t"
                      style={{ background: "#fb923c" }}
                      animate={
                        playing
                          ? { height: [10, 20 + Math.random() * 60, 15, 40 + Math.random() * 40, 10] }
                          : { height: 10 }
                      }
                      transition={{
                        duration: 0.8 + Math.random() * 0.4,
                        repeat: Infinity,
                        delay: i * 0.05,
                      }}
                    />
                  ))}
                </div>

                {/* Lyrics display */}
                <div className="h-20 overflow-hidden text-center">
                  <AnimatePresence mode="wait">
                    {playing && lyricIndex < lyrics.length && (
                      <motion.p
                        key={lyricIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-lg font-medium"
                        style={{ color: "#fbbf24" }}
                      >
                        {lyrics[lyricIndex]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {!playing && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPlaying(true)}
                  className="mx-auto block rounded-full px-10 py-3 text-lg font-bold"
                  style={{
                    background: "#fb923c",
                    color: "#1a0a00",
                  }}
                >
                  ▶ Play
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Stage 3: Hidden Track */}
        {stage === 3 && (
          <motion.div
            key="hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-screen flex-col items-center justify-center px-4"
          >
            {!showHidden ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="cursor-pointer rounded-xl border-2 p-8 text-center"
                style={{
                  borderColor: "#fb923c",
                  background: "rgba(251,146,60,0.1)",
                }}
                onClick={() => setShowHidden(true)}
              >
                <div className="mb-2 text-4xl">🔓</div>
                <p className="text-xl font-bold" style={{ color: "#fb923c" }}>
                  Hidden Track Found!
                </p>
                <p className="text-sm" style={{ color: "#d97706" }}>
                  Click to play
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <p className="mb-2 text-sm uppercase tracking-widest" style={{ color: "#8b6540" }}>
                  Hidden Track
                </p>
                <h2 className="mb-8 text-3xl font-bold sm:text-4xl" style={{ color: "#fbbf24" }}>
                  {config.recipientName}, will you be my Valentine?
                </h2>
                <div className="flex justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fireConfetti()}
                    className="rounded-lg px-10 py-3 text-lg font-bold"
                    style={{ background: "#fb923c", color: "#1a0a00" }}
                  >
                    Yes! 🎵
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 0.9, opacity: 0.5 }}
                    className="rounded-lg border-2 px-8 py-3 text-lg font-semibold"
                    style={{ borderColor: "#5c3a1e", color: "#8b6540" }}
                  >
                    Skip
                  </motion.button>
                </div>
                <p className="mt-4 text-sm" style={{ color: "#8b6540" }}>
                  — {config.senderName}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Mixtape;
