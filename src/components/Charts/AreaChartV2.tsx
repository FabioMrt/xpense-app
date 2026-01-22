"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

type Transaction = {
  id: string;
  description: string;
  value: number;
  type: "ENTRADA" | "SAIDA";
  category: {
    name: string;
  } | null;
  date: Date;
};

type Props = {
  transactions: Transaction[];
};

export function AreaChartV2({ transactions }: Props) {
  const { chartData, trend } = useMemo(() => {
    // Agrupar por dia
    const dailyData: Record<string, { entrada: number; saida: number; saldo: number }> = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const day = date.getDate();
      const key = `${day.toString().padStart(2, "0")}`;

      if (!dailyData[key]) {
        dailyData[key] = { entrada: 0, saida: 0, saldo: 0 };
      }

      if (t.type === "ENTRADA") {
        dailyData[key].entrada += t.value;
      } else {
        dailyData[key].saida += t.value;
      }
    });

    // Calcular saldo acumulado
    let saldoAcumulado = 0;
    const data = Object.entries(dailyData)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([day, values]) => {
        saldoAcumulado += values.entrada - values.saida;
        return {
          day: `Dia ${day}`,
          entrada: values.entrada,
          saida: values.saida,
          saldo: saldoAcumulado,
        };
      });

    // Calcular tendência
    const trendValue = data.length >= 2
      ? data[data.length - 1].saldo - data[0].saldo
      : 0;

    return { chartData: data, trend: trendValue };
  }, [transactions]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <p className="font-bold text-gray-900 dark:text-white mb-3 text-sm">
            {payload[0].payload.day}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1.5">
              <span className="text-xs font-medium" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                {entry.value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card className="border-gray-200 dark:border-gray-700/50 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="p-4 sm:p-5 lg:p-6 pb-2 sm:pb-3">
          <CardTitle className="text-base sm:text-lg lg:text-xl text-gray-900 dark:text-white">
            Fluxo de Caixa
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Acompanhe suas receitas e despesas ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 lg:p-6">
          <div className="h-[200px] sm:h-[280px] lg:h-[320px] flex items-center justify-center text-sm sm:text-base text-gray-500 dark:text-gray-400">
            <p>Nenhum dado disponível para este período</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 dark:border-gray-700/50 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg">
      <CardHeader className="p-4 sm:p-5 lg:p-6 pb-2 sm:pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg lg:text-xl text-gray-900 dark:text-white flex flex-wrap items-center gap-2">
              <span>Fluxo de Caixa</span>
              {trend !== 0 && (
                <span className="text-xs sm:text-sm flex items-center gap-1">
                  {trend > 0 ? (
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                  )}
                  <span className={trend > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                    {Math.abs(trend).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              Acompanhe suas receitas e despesas ao longo do tempo
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
        <div className="w-full h-[200px] sm:h-[280px] lg:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorEntrada" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSaida" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" opacity={0.5} />
              <XAxis
                dataKey="day"
                className="text-xs text-gray-600 dark:text-gray-400"
                tick={{ fill: "currentColor", fontSize: 10 }}
                axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                className="text-xs text-gray-600 dark:text-gray-400"
                tick={{ fill: "currentColor", fontSize: 10 }}
                axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
                width={60}
                tickFormatter={(value) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                    notation: "compact",
                  }).format(value)
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}
                iconType="circle"
                iconSize={8}
              />
              <Area
                type="monotone"
                dataKey="entrada"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorEntrada)"
                name="Entradas"
              />
              <Area
                type="monotone"
                dataKey="saida"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#colorSaida)"
                name="Saídas"
              />
              <Area
                type="monotone"
                dataKey="saldo"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#colorSaldo)"
                name="Saldo"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
