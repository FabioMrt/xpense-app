"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, DollarSign } from "lucide-react";
import SelectMes from "@/components/SelectMes";
import TransactionModal from "@/components/TransactionModal";
import TableTransactions from "@/components/Table";
import { api } from "@/lib/api";

export type Transaction = {
  id: string;
  description: string;
  value: number;
  type: "ENTRADA" | "SAIDA";
  category: {
    name: string;
  } | null;
  date: Date;
};

export default function DashboardClient() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para mês e ano selecionados
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Função para buscar transações
  const fetchTransactions = async (month: number, year: number) => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/api/transactions?month=${month}&year=${year}`);
      setTransactions(response.data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Buscar transações quando mês/ano mudar
  useEffect(() => {
    fetchTransactions(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, session]);

  // Handler para mudança de mês/ano
  const handleMonthYearChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  // Função para recarregar transações (após criar/editar/deletar)
  const refreshTransactions = () => {
    fetchTransactions(selectedMonth, selectedYear);
  };

  // Cálculos das métricas
  const entradaTotal = transactions
    .filter((t) => t.type === "ENTRADA")
    .reduce((acc, curr) => acc + curr.value, 0);

  const saidaTotal = transactions
    .filter((t) => t.type === "SAIDA")
    .reduce((acc, curr) => acc + curr.value, 0);

  const saldo = entradaTotal - saidaTotal;

  if (!session) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="mt-5">
      <Card className="p-4 mb-5">
        <section className="flex items-center justify-between">
          <SelectMes
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthYearChange={handleMonthYearChange}
          />

          <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <TransactionModal onTransactionChange={refreshTransactions} />
          </div>
        </section>

        {/* Cards de métricas */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle className="text-lg sm:text-xl text-gray-700 select-none">
                  Rendas
                </CardTitle>
                <ArrowUpCircle className="ml-auto w-5 h-5" color="green" />
              </div>
              <CardDescription>
                Dinheiro que entrou durante o mês
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-green-950 sm:text-lg font-bold">
                {entradaTotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle className="text-lg sm:text-xl text-gray-700 select-none">
                  Despesas
                </CardTitle>
                <ArrowDownCircle className="ml-auto w-5 h-5" color="red" />
              </div>
              <CardDescription>
                O que foi gasto durante o mês
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-red-800 sm:text-lg font-bold">
                {saidaTotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center">
                <CardTitle className="text-lg sm:text-xl text-gray-700 select-none">
                  Saldo
                </CardTitle>
                <DollarSign className="ml-auto w-5 h-5" color="blue" />
              </div>
              <CardDescription>Saldo do mês</CardDescription>
            </CardHeader>

            <CardContent>
              <p
                className={`sm:text-lg font-bold ${
                  saldo >= 0 ? "text-blue-800" : "text-red-700"
                }`}
              >
                {saldo.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Tabela de transações */}
        <section className="p-2">
          <h1 className="text-gray-800 mb-3 mt-8">Transações do mês</h1>

          {loading ? (
            <p className="text-center p-5 text-gray-700">Carregando transações...</p>
          ) : transactions.length === 0 ? (
            <p className="text-center p-5 text-gray-700">
              Nenhuma transação para o período selecionado.
            </p>
          ) : (
            <TableTransactions
              transactions={transactions}
              onTransactionChange={refreshTransactions}
            />
          )}
        </section>
      </Card>
    </div>
  );
}
