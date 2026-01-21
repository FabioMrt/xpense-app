"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, TrendingUp } from "lucide-react";

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

type CategoryStats = {
  name: string;
  entrada: number;
  saida: number;
  total: number;
  transactionCount: number;
  percentage: number;
};

export function CategoryReport({ transactions }: Props) {
  const categoryStats = useMemo(() => {
    const stats: Record<string, CategoryStats> = {};
    
    // Calcular total geral de saídas para percentagem
    const totalSaidas = transactions
      .filter((t) => t.type === "SAIDA")
      .reduce((acc, t) => acc + t.value, 0);

    transactions.forEach((t) => {
      const categoryName = t.category?.name || "Sem Categoria";
      
      if (!stats[categoryName]) {
        stats[categoryName] = {
          name: categoryName,
          entrada: 0,
          saida: 0,
          total: 0,
          transactionCount: 0,
          percentage: 0,
        };
      }

      if (t.type === "ENTRADA") {
        stats[categoryName].entrada += t.value;
      } else {
        stats[categoryName].saida += t.value;
      }
      
      stats[categoryName].total += t.value;
      stats[categoryName].transactionCount++;
    });

    // Calcular percentagens e ordenar
    return Object.values(stats)
      .map((stat) => ({
        ...stat,
        percentage: totalSaidas > 0 ? (stat.saida / totalSaidas) * 100 : 0,
      }))
      .sort((a, b) => b.saida - a.saida);
  }, [transactions]);

  const totalEntradas = categoryStats.reduce((acc, cat) => acc + cat.entrada, 0);
  const totalSaidas = categoryStats.reduce((acc, cat) => acc + cat.saida, 0);

  if (categoryStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Relatório por Categoria</CardTitle>
          <CardDescription>
            Análise detalhada das suas transações por categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-slate-500 py-8">
            Nenhum dado disponível para este período
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório por Categoria</CardTitle>
        <CardDescription>
          Análise detalhada das suas transações por categoria
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Resumo Geral */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total de Entradas
            </p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {totalEntradas.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total de Saídas
            </p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">
              {totalSaidas.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
        </div>

        {/* Lista de Categorias */}
        <div className="space-y-4">
          {categoryStats.map((cat) => (
            <div
              key={cat.name}
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Cabeçalho da Categoria */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {cat.transactionCount}{" "}
                    {cat.transactionCount === 1 ? "transação" : "transações"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-white">
                    {cat.total.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  {cat.percentage > 0 && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {cat.percentage.toFixed(1)}% do total
                    </p>
                  )}
                </div>
              </div>

              {/* Detalhes de Entrada e Saída */}
              <div className="grid grid-cols-2 gap-4 mb-3">
                {cat.entrada > 0 && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Entradas
                      </p>
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {cat.entrada.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {cat.saida > 0 && (
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Saídas
                      </p>
                      <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                        {cat.saida.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Barra de Progresso para Saídas */}
              {cat.saida > 0 && (
                <div className="space-y-1">
                  <Progress value={cat.percentage} className="h-2" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-right">
                    Média por transação:{" "}
                    {(cat.total / cat.transactionCount).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
