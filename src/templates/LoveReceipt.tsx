import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { config } from "@/config";
import { fireConfetti } from "@/lib/confetti";

const LoveReceipt = () => {
  const [stage, setStage] = useState(0);
  const [printedLines, setPrintedLines] = useState(0);
  const [signed, setSigned] = useState(false);

  const items = config.receiptItems;

  useEffect(() => {
    if (stage !== 2) return;
    if (printedLines > items.length + 3) return;
    const timer = setTimeout(() => setPrintedLines((n) => n + 1), 600);
    return () => clearTimeout(timer);
  }, [stage, printedLines, items.length]);

  const allPrinted = printedLines > items.length + 3;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "#f5f0e8",
        fontFamily: "'Courier New', 'Courier', monospace",
      }}
    >
      <Link
        to="/"
        className="fixed left-4 top-4 z-50 rounded px-4 py-2 text-sm font-medium"
        style={{ background: "#1a1a1a", color: "#f5f0e8" }}
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
            <div className="mb-8 text-8xl">🧾</div>
            <h1 className="mb-4 text-center text-3xl font-bold sm:text-4xl" style={{ color: "#1a1a1a" }}>
              The Love Receipt
            </h1>
            <p className="mb-8 text-center" style={{ color: "#666" }}>
              A minimal accounting of everything that matters
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStage(1)}
              className="px-8 py-3 text-lg font-bold"
              style={{ background: "#1a1a1a", color: "#f5f0e8" }}
            >
              View Receipt
            </motion.button>
          </motion.div>
        )}

        {/* Stage 1: Printer */}
        {stage === 1 && (
          <motion.div
            key="printer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen flex-col items-center justify-center px-4"
          >
            {/* Printer body */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative mb-8"
            >
              <div
                className="h-16 w-64 rounded-t-lg"
                style={{ background: "#333" }}
              />
              <div
                className="h-4 w-64"
                style={{ background: "#222", borderRadius: "0 0 4px 4px" }}
              />
              {/* Paper slot */}
              <div
                className="mx-auto h-1 w-48"
                style={{ background: "#555", marginTop: -2 }}
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStage(2)}
              className="px-8 py-3 text-lg font-bold"
              style={{ background: "#1a1a1a", color: "#f5f0e8" }}
            >
              Print Receipt 🖨️
            </motion.button>
          </motion.div>
        )}

        {/* Stage 2 & 3: Receipt printing */}
        {(stage === 2 || stage === 3) && (
          <motion.div
            key="receipt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-screen flex-col items-center justify-start px-4 py-20"
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              className="w-full max-w-sm overflow-hidden"
            >
              <div
                className="p-6"
                style={{
                  background: "#fff",
                  boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
                  borderBottom: "2px dashed #ccc",
                }}
              >
                {/* Header */}
                {printedLines >= 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-center">
                    <p className="text-lg font-bold" style={{ color: "#1a1a1a" }}>
                      ♥ LOVE CO. ♥
                    </p>
                    <p className="text-xs" style={{ color: "#999" }}>
                      Est. the day we met
                    </p>
                  </motion.div>
                )}

                {printedLines >= 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="mb-3 border-b border-dashed pb-2" style={{ borderColor: "#ccc" }}>
                      <p className="text-xs" style={{ color: "#666" }}>
                        Customer: {config.recipientName}
                      </p>
                      <p className="text-xs" style={{ color: "#666" }}>
                        Cashier: {config.senderName}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Items */}
                {items.map((item, i) => {
                  if (printedLines < i + 3) return null;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-between py-1 text-sm"
                      style={{ color: "#1a1a1a" }}
                    >
                      <span>{item.name}</span>
                      <span className="font-bold">{item.qty}</span>
                    </motion.div>
                  );
                })}

                {/* Total */}
                {printedLines >= items.length + 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="mt-3 border-t border-dashed pt-3" style={{ borderColor: "#ccc" }}>
                      <div className="flex justify-between text-lg font-bold" style={{ color: "#1a1a1a" }}>
                        <span>TOTAL</span>
                        <span>1 Valentine</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Signature area */}
                {allPrinted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6"
                  >
                    <div className="mb-2 border-b border-dashed pb-1" style={{ borderColor: "#ccc" }}>
                      <p className="text-center text-xs" style={{ color: "#999" }}>
                        AUTHORIZATION REQUIRED
                      </p>
                    </div>

                    <div className="my-4 text-center">
                      <p className="text-lg font-bold" style={{ color: "#1a1a1a" }}>
                        Will you be my Valentine?
                      </p>
                      <p className="mt-1 text-sm" style={{ color: "#666" }}>
                        From: {config.senderName}
                      </p>
                    </div>

                    {!signed ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        animate={{
                          boxShadow: [
                            "0 0 0 rgba(26,26,26,0)",
                            "0 0 20px rgba(26,26,26,0.3)",
                            "0 0 0 rgba(26,26,26,0)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        onClick={() => {
                          setSigned(true);
                          fireConfetti();
                        }}
                        className="mt-4 w-full border-2 border-dashed py-3 text-center font-bold"
                        style={{ borderColor: "#1a1a1a", color: "#1a1a1a" }}
                      >
                        ✍️ Sign Here
                      </motion.button>
                    ) : (
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="mt-4 py-4 text-center"
                      >
                        <p
                          className="text-3xl font-black"
                          style={{ color: "#22c55e" }}
                        >
                          ✓ APPROVED
                        </p>
                        <p className="mt-2 text-sm" style={{ color: "#666" }}>
                          Happy Valentine's Day! 💕
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoveReceipt;
