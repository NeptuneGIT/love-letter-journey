import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { config } from "@/config";
import { fireConfetti } from "@/lib/confetti";

const RPGQuest = () => {
  const [stage, setStage] = useState(0);
  const [charPos, setCharPos] = useState(0);
  const [monsterHP, setMonsterHP] = useState(100);
  const [shaking, setShaking] = useState(false);
  const [lootText, setLootText] = useState("");
  const [lootDone, setLootDone] = useState(false);
  const [equipped, setEquipped] = useState(false);

  const fullLootText = `You found ${config.rpgLoot}! ${config.recipientName}, will you equip it?`;

  // Character movement
  const moveChar = useCallback(() => {
    setCharPos((p) => {
      const next = p + 1;
      if (next >= 5) {
        setTimeout(() => setStage(2), 500);
      }
      return next;
    });
  }, []);

  // Loot text typewriter
  useEffect(() => {
    if (stage !== 3) return;
    if (lootText.length >= fullLootText.length) {
      setLootDone(true);
      return;
    }
    const timer = setTimeout(
      () => setLootText(fullLootText.slice(0, lootText.length + 1)),
      50
    );
    return () => clearTimeout(timer);
  }, [stage, lootText, fullLootText]);

  const attack = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 200);
    setMonsterHP((hp) => {
      const next = Math.max(0, hp - 8 - Math.floor(Math.random() * 7));
      if (next <= 0) {
        setTimeout(() => setStage(3), 800);
      }
      return next;
    });
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "#0a1628",
        fontFamily: "'Courier New', monospace",
        imageRendering: "pixelated",
      }}
    >
      <Link
        to="/"
        className="fixed left-2 top-2 z-50 border-2 px-3 py-1 text-xs font-bold"
        style={{ background: "#2d5a27", borderColor: "#5cb85c", color: "#5cb85c" }}
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
            <div className="mb-8 text-8xl">⚔️</div>
            <h1 className="mb-4 text-center text-3xl font-bold sm:text-4xl" style={{ color: "#5cb85c" }}>
              The RPG Quest
            </h1>
            <p className="mb-8 text-center" style={{ color: "#3d8b37" }}>
              An 8-bit adventure to find your Valentine
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStage(1)}
              className="border-2 px-8 py-3 text-lg font-bold"
              style={{ background: "#2d5a27", borderColor: "#5cb85c", color: "#5cb85c" }}
            >
              Start Quest
            </motion.button>
          </motion.div>
        )}

        {/* Stage 1: The Map */}
        {stage === 1 && (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen flex-col items-center justify-center px-4"
          >
            {/* RPG text box */}
            <div
              className="mb-8 w-full max-w-md border-4 p-4"
              style={{ background: "#111", borderColor: "#5cb85c" }}
            >
              <p style={{ color: "#5cb85c" }}>
                It's dangerous to go alone...
              </p>
              <p className="mt-2" style={{ color: "#3d8b37" }}>
                Click to move toward the treasure chest!
              </p>
            </div>

            {/* Map */}
            <div className="relative w-full max-w-md">
              <div className="flex items-center justify-between">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="flex h-16 w-16 items-center justify-center text-2xl"
                    style={{
                      background: i <= charPos ? "rgba(92,184,92,0.1)" : "transparent",
                      border: "2px solid rgba(92,184,92,0.3)",
                    }}
                  >
                    {i === charPos && (
                      <motion.span
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      >
                        🧑‍🤝‍🧑
                      </motion.span>
                    )}
                    {i === 5 && i !== charPos && "📦"}
                    {i < charPos && i !== 5 && (
                      <span style={{ color: "#3d8b37" }}>·</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={moveChar}
              className="mt-8 border-2 px-6 py-2 font-bold"
              style={{ background: "#2d5a27", borderColor: "#5cb85c", color: "#5cb85c" }}
            >
              Move → ({charPos}/5)
            </motion.button>
          </motion.div>
        )}

        {/* Stage 2: Battle */}
        {stage === 2 && (
          <motion.div
            key="battle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen flex-col items-center justify-center px-4"
          >
            <div
              className="mb-4 w-full max-w-md border-4 p-3"
              style={{ background: "#111", borderColor: "#5cb85c" }}
            >
              <p className="text-sm" style={{ color: "#ff6b6b" }}>
                ⚠ A wild LONELINESS appeared!
              </p>
            </div>

            {/* Monster */}
            <motion.div
              animate={shaking ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.2 }}
              className="mb-4 text-center"
            >
              <div className="text-7xl">{monsterHP > 0 ? "👾" : "💀"}</div>
              <p className="mt-2 text-sm font-bold" style={{ color: "#ff6b6b" }}>
                LONELINESS
              </p>
              {/* HP bar */}
              <div className="mx-auto mt-2 h-4 w-48 overflow-hidden border-2" style={{ borderColor: "#5cb85c" }}>
                <motion.div
                  className="h-full"
                  animate={{ width: `${monsterHP}%` }}
                  style={{
                    background:
                      monsterHP > 50 ? "#ff6b6b" : monsterHP > 25 ? "#fbbf24" : "#ef4444",
                  }}
                />
              </div>
              <p className="mt-1 text-xs" style={{ color: "#ff6b6b" }}>
                HP: {monsterHP}/100
              </p>
            </motion.div>

            {monsterHP > 0 && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.8 }}
                onClick={attack}
                className="mt-4 border-4 px-8 py-4 text-lg font-black"
                style={{
                  background: "#b91c1c",
                  borderColor: "#ef4444",
                  color: "#fff",
                }}
              >
                ⚔️ Attack with Love ❤️
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Stage 3: Loot */}
        {stage === 3 && (
          <motion.div
            key="loot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-screen flex-col items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="mb-8 text-7xl"
            >
              {equipped ? "🛡️⚔️" : "📦✨"}
            </motion.div>

            <div
              className="mb-8 w-full max-w-md border-4 p-6"
              style={{ background: "#111", borderColor: "#5cb85c" }}
            >
              <p style={{ color: "#5cb85c" }}>
                {lootText}
                {!lootDone && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    ▌
                  </motion.span>
                )}
              </p>
            </div>

            {lootDone && !equipped && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setEquipped(true);
                    fireConfetti();
                  }}
                  className="border-4 px-8 py-3 font-bold"
                  style={{ background: "#2d5a27", borderColor: "#5cb85c", color: "#5cb85c" }}
                >
                  Yes! Equip ⚔️
                </motion.button>
                <motion.button
                  whileHover={{ scale: 0.9, opacity: 0.5 }}
                  className="border-2 px-6 py-3 font-bold"
                  style={{ borderColor: "#3d8b37", color: "#3d8b37" }}
                >
                  Drop
                </motion.button>
              </motion.div>
            )}

            {equipped && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="mt-4 text-center"
              >
                <motion.p
                  className="text-3xl font-black"
                  style={{
                    color: "#fbbf24",
                    textShadow: "0 0 20px rgba(251,191,36,0.6), 0 0 40px rgba(92,184,92,0.3)",
                  }}
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(251,191,36,0.6), 0 0 40px rgba(92,184,92,0.3)",
                      "0 0 30px rgba(251,191,36,0.9), 0 0 60px rgba(92,184,92,0.5)",
                      "0 0 20px rgba(251,191,36,0.6), 0 0 40px rgba(92,184,92,0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✦ VALENTINE ACCEPTED! ✦
                </motion.p>
                <p className="mt-3 text-lg" style={{ color: "#5cb85c" }}>
                  Happy Valentine's Day! 💚
                </p>
                <p className="mt-2 text-sm" style={{ color: "#3d8b37" }}>
                  — {config.senderName}
                </p>
              </motion.div>
            )}

            {lootDone && !equipped && (
              <p className="mt-4 text-sm" style={{ color: "#3d8b37" }}>
                — {config.senderName}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RPGQuest;
