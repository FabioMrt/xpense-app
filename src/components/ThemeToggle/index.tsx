"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative h-10 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative h-10 w-20 rounded-full bg-gradient-to-r from-purple-500 to-orange-500 p-[2px] transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 dark:hover:shadow-orange-500/50"
      aria-label="Toggle theme"
    >
      <div className="relative flex h-full w-full items-center justify-between rounded-full bg-white px-2 dark:bg-gray-900">
        {/* Sun Icon */}
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 0.8 : 1,
            opacity: isDark ? 0.3 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <Sun className="h-4 w-4 text-orange-500" />
        </motion.div>

        {/* Moon Icon */}
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 1 : 0.8,
            opacity: isDark ? 1 : 0.3,
          }}
          transition={{ duration: 0.3 }}
        >
          <Moon className="h-4 w-4 text-purple-500" />
        </motion.div>

        {/* Sliding Toggle */}
        <motion.div
          className="absolute top-1 h-7 w-7 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 shadow-lg"
          initial={false}
          animate={{
            left: isDark ? "calc(100% - 30px)" : "4px",
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex h-full w-full items-center justify-center"
            >
              {isDark ? (
                <Moon className="h-4 w-4 text-white" />
              ) : (
                <Sun className="h-4 w-4 text-white" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </button>
  );
}
