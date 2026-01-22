"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CountUp from "react-countup";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type Props = {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
  delay?: number;
  percentage?: number;
  prefix?: string;
  suffix?: string;
};

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  delay = 0,
  percentage,
  prefix = "R$ ",
  suffix = "",
}: Props) {
  // Garantir valores seguros
  const safeValue = isFinite(value) ? value : 0;
  const safePercentage = percentage !== undefined && isFinite(percentage) ? percentage : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="relative overflow-hidden
       border-gray-200 dark:border-gray-700/50
        bg-gradient-to-br from-white to-gray-50
         dark:from-gray-800 dark:to-gray-900 shadow-lg 
         hover:shadow-2xl transition-all duration-300
         h-full">
        {/* Efeito de fundo gradiente sutil */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: `linear-gradient(135deg, ${color} 0%, transparent 100%)`,
          }}
        />
        
        <CardContent className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 truncate">
                {title}
              </p>
              <div className="flex items-baseline gap-1 sm:gap-2">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                  {prefix}
                  <CountUp
                    end={safeValue}
                    duration={2}
                    separator="."
                    decimal=","
                    decimals={2}
                    delay={delay}
                  />
                  {suffix}
                </h3>
              </div>
              
              {trend && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay + 0.3 }}
                  className={`inline-flex items-center gap-1 mt-1.5 sm:mt-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                    trend.isPositive
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  <span>
                    {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value).toFixed(1)}%
                  </span>
                  <span className="hidden sm:inline text-gray-500 dark:text-gray-400">vs. anterior</span>
                </motion.div>
              )}
            </div>

            {safePercentage !== undefined ? (
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex-shrink-0 ml-2">
                <CircularProgressbar
                  value={safePercentage}
                  strokeWidth={8}
                  styles={buildStyles({
                    pathColor: color,
                    trailColor: "rgba(156, 163, 175, 0.2)",
                    pathTransitionDuration: 1.5,
                  })}
                />
              </div>
            ) : (
              <div
                className="p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl flex-shrink-0 ml-2"
                style={{
                  background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
                }}
              >
                <Icon
                  className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
                  style={{ color }}
                />
              </div>
            )}
          </div>

          {/* Mini sparkline placeholder - pode ser adicionado depois */}
          {/* <div className="h-8 relative overflow-hidden rounded opacity-30">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${color}30 50%, transparent 100%)`,
                animation: "shimmer 2s infinite",
              }}
            />
          </div> */}
        </CardContent>
      </Card>
    </motion.div>
  );
}
