import { Link } from "react-router-dom";
import { motion } from "framer-motion";


const SOCIETY_DETAILS = {
  name: "The Computer Science Society", 
  logo: "public/photos/logo.png", 
};
// ------------------------------------------------

const templates = [
  {
    category: "Photo Templates",
    items: [
      {
        name: "90s Retro Chaos",
        path: "/retro-chaos",
        description: "Nostalgic Geocities energy with wild colors",
        gradient: "from-yellow-400 via-pink-500 to-cyan-400",
        emoji: "✨",
        accent: "#ff69b4",
      },
      {
        name: "The Mixtape",
        path: "/mixtape",
        description: "A retro cassette with a hidden track",
        gradient: "from-orange-400 via-amber-300 to-yellow-200",
        emoji: "📼",
        accent: "#fb923c",
      },
      {
        name: "90s Desktop",
        path: "/desktop",
        description: "Login to a love-crashed operating system",
        gradient: "from-gray-400 via-teal-300 to-gray-300",
        emoji: "🖥️",
        accent: "#008080",
      },
    ],
  },
  {
    category: "📝 Text Templates",
    items: [
      {
        name: "The Love Receipt",
        path: "/receipt",
        description: "Print a thermal receipt of your love",
        gradient: "from-gray-100 via-white to-gray-200",
        emoji: "🧾",
        accent: "#1a1a1a",
        dark: true,
      },
      {
        name: "The RPG Quest",
        path: "/rpg",
        description: "Defeat loneliness and claim your loot",
        gradient: "from-emerald-500 via-green-400 to-lime-300",
        emoji: "⚔️",
        accent: "#22c55e",
      },
      {
        name: "The Sealed Letter",
        path: "/letter",
        description: "Break the wax seal and read the letter",
        gradient: "from-amber-100 via-orange-50 to-red-100",
        emoji: "✉️",
        accent: "#b91c1c",
      },
    ],
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50">
      
      {/* --- NEW: SOCIETY HEADER --- */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-3 rounded-full bg-white/50 px-4 py-2 shadow-sm backdrop-blur-sm transition-all hover:bg-white/80">
          <img 
            src={SOCIETY_DETAILS.logo} 
            alt={`${SOCIETY_DETAILS.name} Logo`} 
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="font-bold text-rose-700 text-sm sm:text-base">
            {SOCIETY_DETAILS.name}
          </span>
        </div>
      </motion.nav>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-3 text-5xl font-black tracking-tight text-rose-600 sm:text-6xl">
            Walentine Websites
          </h1>
          {/* <p className="mx-auto max-w-md text-lg text-rose-400/80">
            Choose a template, customize it in{" "}, and send it to your Valentine 💌
          </p> */}
        </motion.div>

        {templates.map((group, gi) => (
          <div key={gi} className="mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + gi * 0.1 }}
              className="mb-6 text-xl font-bold text-rose-500"
            >
              {group.category}
            </motion.h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((t, i) => (
                <motion.div
                  key={t.path}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (gi * 3 + i) * 0.08 }}
                >
                  <Link to={t.path} className="group block">
                    <div
                      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${t.gradient} p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
                    >
                      <div className="mb-4 text-5xl">{t.emoji}</div>
                      <h3
                        className={`mb-1 text-xl font-bold ${t.dark ? "text-gray-900" : "text-gray-800"}`}
                      >
                        {t.name}
                      </h3>
                      <p
                        className={`text-sm ${t.dark ? "text-gray-600" : "text-gray-600/80"}`}
                      >
                        {t.description}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gray-700 opacity-0 transition-opacity group-hover:opacity-100">
                        Try it →
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* --- UPDATED: FOOTER WITH SOCIETY NAME --- */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-sm text-rose-400"
        >
          Presented with 💖 by <span className="font-bold">{SOCIETY_DETAILS.name}</span>
        </motion.p>
      </div>
    </div>
  );
};

export default Index;