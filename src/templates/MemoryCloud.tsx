import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { config } from "@/config";
import { fireConfetti } from "@/lib/confetti";

const MemoryCloud = () => {
  const [stage, setStage] = useState(0);
  const [popped, setPopped] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const maskRef = useRef<HTMLCanvasElement>(null);
  const [maskPoints, setMaskPoints] = useState<{ x: number; y: number }[]>([]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (stage !== 1) return;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMaskPoints((p) => [...p, { x, y }]);

      if (maskPoints.length > 80 && !revealed) {
        setRevealed(true);
      }
    },
    [stage, maskPoints.length, revealed]
  );

  const popBubble = (idx: number) => {
    if (popped.includes(idx)) return;
    const next = [...popped, idx];
    setPopped(next);
    if (next.length >= 5) {
      setTimeout(() => setStage(3), 600);
    }
  };

  const bubblePositions = [
    { top: "10%", left: "15%" },
    { top: "25%", left: "65%" },
    { top: "50%", left: "30%" },
    { top: "40%", left: "75%" },
    { top: "65%", left: "50%" },
    { top: "15%", left: "45%" },
    { top: "70%", left: "20%" },
    { top: "55%", left: "80%" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-indigo-100 via-pink-100 to-purple-200">
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute rounded-full bg-white/40"
          style={{
            width: 4 + Math.random() * 8,
            height: 4 + Math.random() * 8,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      <Link
        to="/"
        className="fixed left-4 top-4 z-50 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-purple-600 shadow backdrop-blur transition hover:bg-white"
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
            className="flex min-h-screen flex-col items-center justify-center px-4"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mb-8 text-8xl"
            >
              ☁️
            </motion.div>
            <h1 className="mb-4 text-center text-3xl font-bold text-purple-700 sm:text-4xl">
              The Memory Cloud
            </h1>
            <p className="mb-8 text-center text-purple-500">
              A dreamy journey through your memories together
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStage(1)}
              className="rounded-full bg-purple-500 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-purple-300 transition hover:bg-purple-600"
            >
              Enter the Cloud ✨
            </motion.button>
          </motion.div>
        )}

        {/* Stage 1: The Fog */}
        {stage === 1 && (
          <motion.div
            key="fog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen"
            onPointerMove={handlePointerMove}
          >
            {/* Photos underneath */}
            <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-4 p-8">
              {config.photos.slice(0, 6).map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt=""
                  className="h-32 w-32 rounded-2xl object-cover shadow-lg sm:h-40 sm:w-40"
                />
              ))}
            </div>

            {/* Fog overlay with mask */}
            <div
              className="absolute inset-0 transition-opacity duration-1000"
              style={{
                background:
                  "linear-gradient(135deg, rgba(199,175,255,0.95), rgba(255,182,217,0.95), rgba(168,190,255,0.95))",
                WebkitMaskImage: maskPoints.length
                  ? `radial-gradient(circle 60px, transparent 100%, black 100%) ${maskPoints
                      .map((p) => `${p.x}px ${p.y}px`)
                      .join(", ")}`
                  : undefined,
                maskImage: maskPoints.length
                  ? `radial-gradient(circle 60px, transparent 100%, black 100%)`
                  : undefined,
                opacity: revealed ? 0 : 1,
              }}
            />

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <motion.p
                animate={{ opacity: revealed ? 0 : [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center text-2xl font-semibold text-white drop-shadow-lg"
              >
                {revealed ? "" : "Move your cursor to clear the mist… ✨"}
              </motion.p>
            </div>

            {revealed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-end justify-center pb-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStage(2)}
                  className="rounded-full bg-purple-500 px-8 py-3 font-semibold text-white shadow-lg"
                >
                  Continue →
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Stage 2: Pop Bubbles */}
        {stage === 2 && (
          <motion.div
            key="bubbles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg font-semibold text-purple-600">
                Pop the memory bubbles! ({popped.length}/5)
              </p>
            </div>

            {config.photos.slice(0, 8).map((photo, i) => (
              <motion.div
                key={i}
                className="absolute cursor-pointer"
                style={bubblePositions[i]}
                animate={
                  popped.includes(i)
                    ? { scale: 0, opacity: 0 }
                    : {
                        y: [0, -15, 0, 10, 0],
                        x: [0, 8, -8, 5, 0],
                      }
                }
                transition={
                  popped.includes(i)
                    ? { duration: 0.3 }
                    : {
                        duration: 4 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }
                }
                onClick={() => popBubble(i)}
              >
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-pink-300/50 to-purple-300/50 blur-sm" />
                  <img
                    src={photo}
                    alt=""
                    className="relative h-20 w-20 rounded-full border-4 border-white/60 object-cover shadow-xl sm:h-24 sm:w-24"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stage 3: The Question */}
        {stage === 3 && (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-screen flex-col items-center justify-center px-4"
          >
            {/* Heart formation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1 }}
              className="mb-8 text-8xl"
            >
              💜
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-2 text-center text-3xl font-bold text-purple-700 sm:text-4xl"
            >
              {config.recipientName},
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8 text-center text-2xl font-semibold text-purple-500"
            >
              Will you be my Valentine?
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => fireConfetti()}
                className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-10 py-3 text-lg font-bold text-white shadow-lg"
              >
                Yes! 💜
              </motion.button>
              <motion.button
                whileHover={{ scale: 0.9, opacity: 0.5 }}
                className="rounded-full border-2 border-purple-300 px-8 py-3 text-lg font-semibold text-purple-400"
              >
                Maybe later
              </motion.button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-4 text-sm text-purple-400"
            >
              — {config.senderName}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemoryCloud;
