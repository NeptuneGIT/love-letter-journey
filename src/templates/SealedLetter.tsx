import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { config } from "@/config";
import { fireConfetti } from "@/lib/confetti";

const SealedLetter = () => {
  const [stage, setStage] = useState(0);
  const [sealBroken, setSealBroken] = useState(false);
  const [topFlap, setTopFlap] = useState(false);
  const [bottomFlap, setBottomFlap] = useState(false);
  const [letterText, setLetterText] = useState("");
  const [textDone, setTextDone] = useState(false);
  const [signed, setSigned] = useState(false);

  const words = config.message.split(" ");

  useEffect(() => {
    if (stage !== 3) return;
    const wordCount = letterText.split(" ").filter(Boolean).length;
    if (wordCount >= words.length) {
      setTextDone(true);
      return;
    }
    const timer = setTimeout(
      () => setLetterText(words.slice(0, wordCount + 1).join(" ")),
      120
    );
    return () => clearTimeout(timer);
  }, [stage, letterText, words]);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #fdf6e3 0%, #f5e6c8 50%, #ecdbb3 100%)",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      <Link
        to="/"
        className="fixed left-4 top-4 z-50 rounded-full px-4 py-2 text-sm font-medium shadow"
        style={{ background: "#b91c1c", color: "#fdf6e3" }}
      >
        ← Gallery
      </Link>

      {/* Parchment texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
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
            <div className="mb-8 text-8xl">✉️</div>
            <h1 className="mb-4 text-center text-3xl font-bold italic sm:text-4xl" style={{ color: "#5c3a1e" }}>
              The Sealed Letter
            </h1>
            <p className="mb-8 text-center italic" style={{ color: "#8b6914" }}>
              An elegant confession, sealed with care
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStage(1)}
              className="rounded-lg px-8 py-3 text-lg font-semibold shadow-lg"
              style={{ background: "#b91c1c", color: "#fdf6e3" }}
            >
              Receive Letter
            </motion.button>
          </motion.div>
        )}

        {/* Stage 1: Envelope delivery */}
        {stage === 1 && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen flex-col items-center justify-center px-4"
          >
            <motion.div
              initial={{ x: -300, rotate: -10 }}
              animate={{ x: 0, rotate: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative mb-8"
            >
              {/* Envelope */}
              <div
                className="relative h-48 w-72 rounded-lg shadow-xl sm:h-56 sm:w-80"
                style={{ background: "#f5e6c8", border: "2px solid #d4b896" }}
              >
                {/* Flap */}
                <div
                  className="absolute left-0 right-0 top-0 h-24"
                  style={{
                    background: "#ecdbb3",
                    clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                    borderBottom: "2px solid #d4b896",
                  }}
                />
                {/* Wax seal */}
                <div className="absolute left-1/2 top-16 -translate-x-1/2">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold shadow-lg"
                    style={{ background: "#b91c1c", color: "#fdf6e3" }}
                  >
                    ♥
                  </div>
                </div>
                {/* Label */}
                <div className="absolute bottom-6 left-0 right-0 text-center">
                  <p className="text-sm italic" style={{ color: "#8b6914" }}>
                    For Your Eyes Only
                  </p>
                  <p className="mt-1 text-lg font-bold" style={{ color: "#5c3a1e" }}>
                    {config.recipientName}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStage(2)}
              className="rounded-lg px-8 py-3 font-semibold shadow"
              style={{ background: "#b91c1c", color: "#fdf6e3" }}
            >
              Open Envelope
            </motion.button>
          </motion.div>
        )}

        {/* Stage 2: Unfolding */}
        {stage === 2 && (
          <motion.div
            key="unfold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen flex-col items-center justify-center px-4"
          >
            <div className="mb-8 text-center">
              {/* Step indicators */}
              <div className="mb-6 flex items-center justify-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    background: sealBroken ? "#22c55e" : "#b91c1c",
                    color: "#fff",
                  }}
                >
                  {sealBroken ? "✓" : "1"}
                </div>
                <div className="h-px w-8" style={{ background: "#d4b896" }} />
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    background: topFlap ? "#22c55e" : sealBroken ? "#b91c1c" : "#d4b896",
                    color: sealBroken ? "#fff" : "#8b6914",
                  }}
                >
                  {topFlap ? "✓" : "2"}
                </div>
                <div className="h-px w-8" style={{ background: "#d4b896" }} />
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    background: bottomFlap ? "#22c55e" : topFlap ? "#b91c1c" : "#d4b896",
                    color: topFlap ? "#fff" : "#8b6914",
                  }}
                >
                  {bottomFlap ? "✓" : "3"}
                </div>
              </div>
            </div>

            {!sealBroken && (
              <motion.div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="mx-auto mb-4 flex h-20 w-20 cursor-pointer items-center justify-center rounded-full text-3xl font-bold shadow-xl"
                  style={{ background: "#b91c1c", color: "#fdf6e3" }}
                  onClick={() => setSealBroken(true)}
                >
                  ♥
                </motion.div>
                <p className="italic" style={{ color: "#8b6914" }}>
                  Click to break the wax seal
                </p>
              </motion.div>
            )}

            {sealBroken && !topFlap && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotateX: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mx-auto mb-4 flex h-20 w-32 cursor-pointer items-center justify-center rounded-t-lg shadow-lg"
                  style={{
                    background: "#ecdbb3",
                    border: "2px solid #d4b896",
                    borderBottom: "none",
                  }}
                  onClick={() => setTopFlap(true)}
                >
                  <span style={{ color: "#8b6914" }}>▽</span>
                </motion.div>
                <p className="italic" style={{ color: "#8b6914" }}>
                  Unfold the top flap
                </p>
              </motion.div>
            )}

            {topFlap && !bottomFlap && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotateX: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mx-auto mb-4 flex h-20 w-32 cursor-pointer items-center justify-center rounded-b-lg shadow-lg"
                  style={{
                    background: "#ecdbb3",
                    border: "2px solid #d4b896",
                    borderTop: "none",
                  }}
                  onClick={() => {
                    setBottomFlap(true);
                    setTimeout(() => setStage(3), 500);
                  }}
                >
                  <span style={{ color: "#8b6914" }}>△</span>
                </motion.div>
                <p className="italic" style={{ color: "#8b6914" }}>
                  Unfold the bottom flap
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Stage 3: The Letter */}
        {stage === 3 && (
          <motion.div
            key="letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-screen flex-col items-center justify-center px-4 py-16"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md rounded-lg p-8 shadow-2xl"
              style={{
                background: "#fdf6e3",
                border: "2px solid #d4b896",
              }}
            >
              <p className="mb-4 text-sm italic" style={{ color: "#8b6914" }}>
                Dearest {config.recipientName},
              </p>

              <p
                className="mb-6 text-base leading-relaxed"
                style={{ color: "#5c3a1e", minHeight: 80 }}
              >
                {letterText}
                {!textDone && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    style={{ color: "#b91c1c" }}
                  >
                    |
                  </motion.span>
                )}
              </p>

              {textDone && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 border-t pt-6"
                  style={{ borderColor: "#d4b896" }}
                >
                  <p className="mb-4 text-center italic" style={{ color: "#5c3a1e" }}>
                    Will you be my Valentine?
                  </p>

                  {!signed ? (
                    <motion.div
                      className="mx-auto flex w-48 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed py-3"
                      style={{ borderColor: "#b91c1c" }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        borderColor: ["#b91c1c", "#ef4444", "#b91c1c"],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      onClick={() => {
                        setSigned(true);
                        fireConfetti();
                      }}
                    >
                      <span style={{ color: "#b91c1c" }}>✍️</span>
                      <span className="font-semibold" style={{ color: "#b91c1c" }}>
                        Sign "Yes" ✓
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-center"
                    >
                      <p
                        className="text-3xl font-bold italic"
                        style={{ color: "#b91c1c" }}
                      >
                        Yes ✓
                      </p>
                      <p className="mt-2 text-sm" style={{ color: "#8b6914" }}>
                        Forever & always 💕
                      </p>
                    </motion.div>
                  )}

                  <p
                    className="mt-6 text-right text-sm italic"
                    style={{ color: "#8b6914" }}
                  >
                    With all my love,
                    <br />
                    {config.senderName}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SealedLetter;
