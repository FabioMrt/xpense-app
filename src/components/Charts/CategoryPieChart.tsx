"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
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
];

export function CategoryPieChart({ transactions, type }: Props) {
  const data = useMemo(() => {
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
    
    return result;
  }, [transactions, type]);

  const total = useMemo(() => {
    return data.reduce((acc, item) => acc + item.value, 0);
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white mb-1">
            {payload[0].name}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {payload[0].value.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
          <p className="text-sm font-semibold" style={{ color: payload[0].payload.fill }}>
            {percentage}% do total
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <Card className="border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-gray-900 dark:text-white">
            {type === "ENTRADA" ? "Entradas" : "Saídas"} por Categoria
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Distribuição de {type === "ENTRADA" ? "receitas" : "despesas"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex items-center justify-center text-gray-500 dark:text-gray-400">
            <p>
              Nenhuma {type === "ENTRADA" ? "entrada" : "saída"} neste período
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-gray-900 dark:text-white">
          {type === "ENTRADA" ? "Entradas" : "Saídas"} por Categoria
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Distribuição de {type === "ENTRADA" ? "receitas" : "despesas"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={30}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend customizada com valores */}
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-1.5 text-xs">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-700 dark:text-gray-300 truncate">
                {item.name}:{" "}
                <span className="font-semibold">
                  {item.value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
