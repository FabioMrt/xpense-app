"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  type: "ENTRADA" | "SAIDA";
};

const COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // green
  "#06b6d4", // cyan
  "#f97316", // orange
  "#ef4444", // red
  "#6366f1", // indigo
  "#14b8a6", // teal
];

export function DonutChartV2({ transactions, type }: Props) {
  const { data, total } = useMemo(() => {
    const aggregated: Record<string, number> = {};

    const filteredTransactions = transactions.filter((t) => t.type === type);
    
    filteredTransactions.forEach((t) => {
      const categoryName = t.category?.name || "Sem Categoria";
      aggregated[categoryName] = (aggregated[categoryName] || 0) + t.value;
    });

    const result = Object.entries(aggregated)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
    
    const totalValue = result.reduce((acc, item) => acc + item.value, 0);

    return { data: result, total: totalValue };
  }, [transactions, type]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <p className="font-bold text-gray-900 dark:text-white mb-2 text-sm">
            {payload[0].name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {payload[0].value.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: payload[0].payload.fill }}
            />
            <p className="text-sm font-bold" style={{ color: payload[0].payload.fill }}>
              {percentage}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Não mostrar label para fatias muito pequenas

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-bold drop-shadow-lg"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (data.length === 0) {
    return (
      <Card className="border-gray-200 dark:border-gray-700/50 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="p-4 sm:p-5 lg:p-6 pb-2 sm:pb-3">
          <CardTitle className="text-base sm:text-lg lg:text-xl text-gray-900 dark:text-white">
            {type === "ENTRADA" ? "Entradas" : "Saídas"} por Categoria
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Distribuição de {type === "ENTRADA" ? "receitas" : "despesas"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 lg:p-6">
          <div className="h-[200px] sm:h-[280px] lg:h-[320px] flex items-center justify-center text-sm sm:text-base text-gray-500 dark:text-gray-400">
            <p>
              Nenhuma {type === "ENTRADA" ? "entrada" : "saída"} neste período
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 dark:border-gray-700/50 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg">
      <CardHeader className="p-4 sm:p-5 lg:p-6 pb-2 sm:pb-3">
        <CardTitle className="text-base sm:text-lg lg:text-xl text-gray-900 dark:text-white">
          {type === "ENTRADA" ? "Entradas" : "Saídas"} por Categoria
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
          Distribuição de {type === "ENTRADA" ? "receitas" : "despesas"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
        {/* Centro com total */}
        <div className="relative">
          <div className="w-full h-[200px] sm:h-[280px] lg:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius="40%"
                  innerRadius="25%"
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Valor total no centro */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5 sm:mb-1">
              Total
            </p>
            <p className="text-sm sm:text-base lg:text-xl font-bold text-gray-900 dark:text-white">
              {total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>

        {/* Legend customizada */}
        <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
          {data.slice(0, 6).map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div
                key={item.name}
                className="flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <div
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 truncate font-medium">
                    {item.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                    {percentage}% •{" "}
                    {item.value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 0,
                      notation: window.innerWidth < 640 ? "compact" : "standard",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {data.length > 6 && (
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1.5 sm:mt-2 text-center">
            +{data.length - 6} outras categorias
          </p>
        )}
      </CardContent>
    </Card>
  );
}
