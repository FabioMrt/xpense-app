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
import { ArrowDownCircle, ArrowUpCircle, DollarSign, Download, FileText } from "lucide-react";
import SelectMes from "@/components/SelectMes";
import TransactionModal from "@/components/TransactionModal";
import TableTransactions from "@/components/Table";
import { TransactionChart } from "@/components/Charts/TransactionChart";
import { CategoryPieChart } from "@/components/Charts/CategoryPieChart";
import { CategoryReport } from "@/components/CategoryReport";
import { TransactionFilters } from "@/components/TransactionFilters";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { exportToCSV, exportToPDF } from "@/lib/exportData";

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
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para mês e ano selecionados
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Buscar categorias
  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  // Função para buscar transações
  const fetchTransactions = async (month: number, year: number) => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/api/transactions?month=${month}&year=${year}`);
      
      // Verificar se a resposta tem o formato novo com success
      const data = response.data.success ? response.data.data : response.data;
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (error: any) {
      console.error("Erro ao buscar transações:", error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Erro ao carregar transações";
      
      toast.error(errorMessage);
      setTransactions([]);
      setFilteredTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para filtrar transações
  const handleFilterChange = (filters: { search: string; type: string; category: string }) => {
    let filtered = [...transactions];

    // Filtro de busca
    if (filters.search) {
      filtered = filtered.filter((t) =>
        t.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtro de tipo
    if (filters.type !== "ALL") {
      filtered = filtered.filter((t) => t.type === filters.type);
    }

    // Filtro de categoria
    if (filters.category !== "ALL") {
      filtered = filtered.filter((t) => t.category?.name === filters.category);
    }

    setFilteredTransactions(filtered);
  };

  // Buscar categorias ao montar
  useEffect(() => {
    fetchCategories();
  }, []);

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

  // Cálculos das métricas (sempre usar transactions originais, não filtradas)
  const entradaTotal = transactions
    .filter((t) => t.type === "ENTRADA")
    .reduce((acc, curr) => acc + curr.value, 0);

  const saidaTotal = transactions
    .filter((t) => t.type === "SAIDA")
    .reduce((acc, curr) => acc + curr.value, 0);

  const saldo = entradaTotal - saidaTotal;

  // Handlers de exportação
  const handleExportCSV = () => {
    exportToCSV(filteredTransactions, selectedMonth, selectedYear);
    toast.success("Dados exportados com sucesso!");
  };

  const handleExportPDF = () => {
    exportToPDF(filteredTransactions, selectedMonth, selectedYear);
    toast.success("Relatório gerado com sucesso!");
  };

  if (!session) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="mt-5">
      <Card className="p-4 mb-5">
        <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <SelectMes
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthYearChange={handleMonthYearChange}
          />

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={filteredTransactions.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              disabled={filteredTransactions.length === 0}
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
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

        {/* Gráficos */}
        {!loading && transactions.length > 0 && (
          <>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
              <TransactionChart transactions={transactions} />
              <CategoryPieChart transactions={transactions} type="SAIDA" />
            </section>
            
            {/* Relatório Detalhado por Categoria */}
            <section className="mt-6">
              <CategoryReport transactions={transactions} />
            </section>
          </>
        )}

        {/* Filtros e Tabela de transações */}
        <section className="p-2">
          <h1 className="text-gray-800 dark:text-gray-200 mb-3 mt-8 font-semibold">
            Transações do mês
            {filteredTransactions.length !== transactions.length && (
              <span className="text-sm font-normal text-slate-500 ml-2">
                ({filteredTransactions.length} de {transactions.length})
              </span>
            )}
          </h1>

          {!loading && transactions.length > 0 && (
            <div className="mb-4">
              <TransactionFilters
                onFilterChange={handleFilterChange}
                categories={categories}
              />
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"
                />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                  Nenhuma transação para o período selecionado.
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
                  Clique em "Adicionar transação" para começar
                </p>
              </CardContent>
            </Card>
          ) : filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                  Nenhuma transação encontrada com os filtros aplicados.
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
                  Tente ajustar os filtros de busca
                </p>
              </CardContent>
            </Card>
          ) : (
            <TableTransactions
              transactions={filteredTransactions}
              onTransactionChange={refreshTransactions}
            />
          )}
        </section>
      </Card>
    </div>
  );
}
