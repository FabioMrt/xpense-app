"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
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
};

export function TransactionChart({ transactions }: Props) {
  // Agregar transações por categoria
  const categoryData = useMemo(() => {
    const aggregated: Record<string, { entrada: number; saida: number }> = {};

    transactions.forEach((t) => {
      const categoryName = t.category?.name || "Sem Categoria";
      if (!aggregated[categoryName]) {
        aggregated[categoryName] = { entrada: 0, saida: 0 };
      }

      if (t.type === "ENTRADA") {
        aggregated[categoryName].entrada += t.value;
      } else {
        aggregated[categoryName].saida += t.value;
      }
    });

    return Object.entries(aggregated).map(([name, values]) => ({
      category: name,
      entrada: values.entrada,
      saida: values.saida,
    }));
  }, [transactions]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white mb-2">
            {payload[0].payload.category}
          </p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (categoryData.length === 0) {
    return (
      <Card className="border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-gray-900 dark:text-white">Transações por Categoria</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Visualize suas receitas e despesas por categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex items-center justify-center text-gray-500 dark:text-gray-400">
            <p>Nenhum dado disponível para este período</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-gray-900 dark:text-white">Transações por Categoria</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Visualize suas receitas e despesas por categoria
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis
              dataKey="category"
              className="text-xs text-slate-600 dark:text-slate-400"
              tick={{ fill: "currentColor" }}
            />
            <YAxis
              className="text-xs text-slate-600 dark:text-slate-400"
              tick={{ fill: "currentColor" }}
              tickFormatter={(value) =>
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 0,
                }).format(value)
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Bar
              dataKey="entrada"
              fill="#10b981"
              name="Entradas"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="saida"
              fill="#ef4444"
              name="Saídas"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
