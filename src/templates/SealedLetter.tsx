import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import { config } from "@/config";
import { fireConfetti } from "@/lib/confetti";

const SealedLetter = () => {
  const [stage, setStage] = useState(0); // 0: Intro, 1: Envelope, 2: Letter Content
  const [isHolding, setIsHolding] = useState(false);
  const [sealBroken, setSealBroken] = useState(false);
  const [flapOpen, setFlapOpen] = useState(false);
  const [letterText, setLetterText] = useState("");
  const [textDone, setTextDone] = useState(false);
  const [signed, setSigned] = useState(false);

  // Refs for "Hold to Break" logic
  const holdTimer = useRef(null);
  const vibrationControls = useAnimation();
  
  const words = config.message.split(" ");

  // Typewriter effect logic
  useEffect(() => {
    if (stage !== 2) return;
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

  // Handle the "Hold to Break" interaction
  const startHold = () => {
    if (sealBroken) return;
    setIsHolding(true);
    
    // Start vibration animation
    vibrationControls.start({
      x: [-2, 2, -2, 2],
      transition: { repeat: Infinity, duration: 0.1 }
    });

    // Set timer to break the seal after 1.5 seconds
    holdTimer.current = setTimeout(() => {
      setSealBroken(true);
      setIsHolding(false);
      vibrationControls.stop();
      
      // Auto open flap after seal breaks
      setTimeout(() => setFlapOpen(true), 500);
    }, 1500);
  };

  const endHold = () => {
    if (sealBroken) return;
    setIsHolding(false);
    vibrationControls.stop();
    vibrationControls.start({ x: 0 }); // Reset position
    if (holdTimer.current) clearTimeout(holdTimer.current);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden w-full"
      style={{
        background: "linear-gradient(180deg, #fdf6e3 0%, #f5e6c8 50%, #ecdbb3 100%)",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
      onMouseUp={endHold}
      onTouchEnd={endHold}
    >
      <Link
        to="/"
        className="fixed left-4 top-4 z-50 rounded-full px-4 py-2 text-sm font-medium shadow transition-colors hover:bg-red-800"
        style={{ background: "#b91c1c", color: "#fdf6e3" }}
      >
        ← Gallery
      </Link>

      {/* Parchment texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-30"
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
            exit={{ opacity: 0, y: -50 }}
            className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8 text-8xl"
            >
              ✉️
            </motion.div>
            <h1 className="mb-4 text-center text-3xl font-bold italic sm:text-4xl" style={{ color: "#5c3a1e" }}>
              The Sealed Letter
            </h1>
            <p className="mb-8 text-center italic" style={{ color: "#8b6914" }}>
              {config.recipientName}, a message awaits you.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStage(1)}
              className="rounded-lg px-8 py-3 text-lg font-semibold shadow-lg transition-all"
              style={{ background: "#b91c1c", color: "#fdf6e3" }}
            >
              View Delivery
            </motion.button>
          </motion.div>
        )}

        {/* Stage 1: The Gamified Envelope */}
        {stage === 1 && (
          <motion.div
            key="envelope-interactive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-hidden px-4"
          >
            {/* Instruction Text */}
            <motion.p
              key={sealBroken ? "pull" : "hold"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-[15%] z-20 text-lg font-bold italic tracking-wide"
              style={{ color: "#5c3a1e" }}
            >
              {!sealBroken 
                ? (isHolding ? "Keep holding..." : "Hold the seal to break it") 
                : "Pull the letter up!"}
            </motion.p>

            {/* The Envelope Assembly */}
            <div className="relative mt-12 h-64 w-80 sm:h-72 sm:w-96">
              {/* 1. Inside Back of Envelope (Base) */}
              <div 
                className="absolute inset-0 rounded-lg shadow-2xl" 
                style={{ background: "#e6d2b5", border: "2px solid #d4b896" }} 
              />

              {/* 2. The Letter Card (Draggable) */}
              <motion.div
                className="absolute left-4 right-4 top-2 bottom-2 flex cursor-grab flex-col items-center justify-start rounded-lg bg-white p-4 pt-8 shadow-sm active:cursor-grabbing"
                style={{ zIndex: 30 }} 
                // Initial state: hidden deep inside
                initial={{ y: 50, opacity: 0 }}
                // Animate state: Only reveal when flap opens
                animate={flapOpen ? { y: -100, opacity: 1 } : { y: 50, opacity: 0 }}
                // Smooth transition for the reveal
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                drag={flapOpen ? "y" : false}
                dragConstraints={{ top: -300, bottom: -100 }}
                dragElastic={0.1}
                dragMomentum={false}
                onDragEnd={(_, info) => {
                  if (info.offset.y < -50) {
                    setStage(2);
                  }
                }}
              >
                <div className="mb-2 h-1 w-12 rounded bg-gray-300 opacity-50" />
                <p className="text-xs text-gray-400">Drag me up...</p>
              </motion.div>

              {/* 3. Side Flaps */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1/2"
                style={{ 
                  zIndex: 20, 
                  background: "#ecd9b8",
                  clipPath: "polygon(0 0, 0% 100%, 100% 50%)",
                  borderLeft: "2px solid #d4b896"
                }}
              />
              <div 
                className="absolute right-0 top-0 bottom-0 w-1/2"
                style={{ 
                  zIndex: 20, 
                  background: "#ecd9b8",
                  clipPath: "polygon(100% 0, 100% 100%, 0% 50%)",
                  borderRight: "2px solid #d4b896"
                }}
              />

              {/* 4. Envelope Front (Bottom Pocket) */}
              <div
                className="absolute bottom-0 left-0 right-0 h-32 rounded-b-lg sm:h-36"
                style={{
                  zIndex: 30,
                  background: "#f5e6c8",
                  clipPath: "polygon(0 0, 50% 15%, 100% 0, 100% 100%, 0 100%)",
                  border: "2px solid #d4b896",
                  filter: "drop-shadow(0 -2px 4px rgba(0,0,0,0.1))"
                }}
              />

              {/* 5. Envelope Flap (Top Triangle) */}
              <motion.div
                className="absolute left-0 right-0 top-0 h-32 origin-top sm:h-36"
                style={{
                  zIndex: 40,
                  background: "#ecdbb3",
                  clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                  borderTop: "2px solid #d4b896",
                }}
                animate={flapOpen ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 40 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />

              {/* 6. The Wax Seal */}
              <AnimatePresence>
                {!sealBroken && (
                  <div 
                    className="absolute left-1/2 top-[100px] -translate-x-1/2" 
                    style={{ zIndex: 100 }}
                  >
                  <motion.button
                    key="seal"
                    className="cursor-pointer outline-none"
                    onMouseDown={startHold}
                    onTouchStart={startHold}
                    onMouseUp={endHold}
                    onTouchEnd={endHold}
                    animate={vibrationControls}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      animate={isHolding ? { scale: 1.1 } : { scale: 1 }}
                      className="flex h-16 w-16 items-center justify-center rounded-full shadow-lg border-4 border-red-900"
                      style={{ background: "#b91c1c" }}
                    >
                      <motion.span 
                        className="text-2xl text-red-100"
                        animate={isHolding ? { opacity: 0.5 } : { opacity: 1 }}
                      >
                        ♥
                      </motion.span>
                    </motion.div>
                    
                    {/* Hold Progress Ring */}
                    {isHolding && (
                      <svg className="absolute -left-2 -top-2 h-20 w-20 rotate-[-90deg]">
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="white"
                          strokeWidth="3"
                          fill="transparent"
                          strokeDasharray="226"
                          strokeDashoffset="226"
                        >
                          <animate
                            attributeName="stroke-dashoffset"
                            from="226"
                            to="0"
                            dur="1.5s"
                            fill="freeze"
                          />
                        </circle>
                      </svg>
                    )}
                  </motion.button>
                  </div>
                )}
              </AnimatePresence>
              
            </div>
          </motion.div>
        )}

        {/* Stage 2: The Letter Content (Reading) */}
        {stage === 2 && (
          <motion.div
            key="letter-read"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16"
          >
            <motion.div
              className="w-full max-w-md rounded-lg p-8 shadow-2xl relative"
              style={{
                background: "#fdf6e3",
                border: "1px solid #e6d2b5",
              }}
            >
              {/* Paper texture overlay for the card */}
              <div 
                  className="absolute inset-0 opacity-50 pointer-events-none rounded-lg"
                  style={{ zIndex: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%23d4b896' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
              />

              <div className="relative z-10">
                <p className="mb-6 text-sm italic" style={{ color: "#8b6914" }}>
                  Dearest {config.recipientName},
                </p>

                <p
                  className="mb-8 text-base leading-relaxed whitespace-pre-wrap font-serif"
                  style={{ color: "#5c3a1e", minHeight: "120px" }}
                >
                  {letterText}
                  {!textDone && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-1 h-5 ml-1 align-middle"
                      style={{ background: "#b91c1c" }}
                    />
                  )}
                </p>

                {textDone && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 border-t pt-6"
                    style={{ borderColor: "#e6d2b5" }}
                  >
                    <p className="mb-6 text-center text-lg font-bold italic" style={{ color: "#5c3a1e" }}>
                      Will you be my Valentine?
                    </p>

                    <div className="flex justify-center">
                      {!signed ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSigned(true);
                            fireConfetti();
                          }}
                          className="flex items-center gap-2 rounded-full px-8 py-3 font-semibold text-white shadow-lg transition-all"
                          style={{ background: "#b91c1c" }}
                        >
                          <span>✍️</span>
                          Sign "Yes"
                        </motion.button>
                      ) : (
                        <motion.div
                          initial={{ scale: 0, rotate: -10 }}
                          animate={{ scale: 1, rotate: 0 }}
                          type="spring"
                          className="text-center"
                        >
                          <div className="text-4xl font-bold text-red-600 mb-2 font-handwriting">
                            Yes!
                          </div>
                          <p className="text-sm italic" style={{ color: "#8b6914" }}>
                            Forever & always 💕
                          </p>
                        </motion.div>
                      )}
                    </div>

                    <p
                      className="mt-8 text-right text-sm italic"
                      style={{ color: "#8b6914" }}
                    >
                      With all my love,
                      <br />
                      <span className="font-semibold">{config.senderName}</span>
                    </p>
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

export default SealedLetter;