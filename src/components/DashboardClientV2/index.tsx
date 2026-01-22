"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  Download,
  FileText,
  TrendingUp,
  Wallet,
  PiggyBank,
  Activity,
  Target,
  Calendar,
  Filter,
} from "lucide-react";
import SelectMes from "@/components/SelectMes";
import TransactionModal from "@/components/TransactionModal";
import TableTransactions from "@/components/Table";
import { AreaChartV2 } from "@/components/Charts/AreaChartV2";
import { DonutChartV2 } from "@/components/Charts/DonutChartV2";
import { KPICard } from "@/components/KPICard";
import { TransactionFilters } from "@/components/TransactionFilters";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { exportToCSV, exportToPDF } from "@/lib/exportData";
import { motion } from "framer-motion";

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

export default function DashboardClientV2() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  }, []);

  const fetchTransactions = useCallback(async (month: number, year: number) => {
    if (!session?.user) return;

    setLoading(true);
    try {
      const response = await api.get(`/api/transactions?month=${month}&year=${year}`);
      const data = response.data.success ? response.data.data : response.data;
      
      // Converter strings de data para objetos Date
      const transactionsWithDates = data.map((t: any) => ({
        ...t,
        date: new Date(t.date),
      }));
      
      setTransactions(transactionsWithDates);
      setFilteredTransactions(transactionsWithDates);
    } catch (error: any) {
      console.error("Erro ao buscar transações:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erro ao carregar transações";
      toast.error(errorMessage);
      setTransactions([]);
      setFilteredTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  const handleFilterChange = useCallback((filters: { search: string; type: string; category: string }) => {
    let filtered = [...transactions];

    if (filters.search) {
      filtered = filtered.filter((t) =>
        t.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.type !== "ALL") {
      filtered = filtered.filter((t) => t.type === filters.type);
    }

    if (filters.category && filters.category !== "ALL") {
      filtered = filtered.filter((t) => t.category?.name === filters.category);
    }

    setFilteredTransactions(filtered);
  }, [transactions]);

  const handleMonthYearChange = useCallback((month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  }, []);

  const refreshTransactions = useCallback(() => {
    fetchTransactions(selectedMonth, selectedYear);
  }, [fetchTransactions, selectedMonth, selectedYear]);

  useEffect(() => {
    if (session?.user) {
      fetchTransactions(selectedMonth, selectedYear);
    }
  }, [session?.user, selectedMonth, selectedYear, fetchTransactions]);

  useEffect(() => {
    if (session?.user) {
      fetchCategories();
    }
  }, [session?.user, fetchCategories]);

  // Garantir que filteredTransactions seja atualizado quando transactions mudar
  useEffect(() => {
    if (transactions.length > 0 && filteredTransactions.length === 0) {
      setFilteredTransactions(transactions);
    }
  }, [transactions, filteredTransactions.length]);

  const totalEntradas = transactions
    .filter((t) => t.type === "ENTRADA")
    .reduce((acc, t) => acc + t.value, 0);

  const totalSaidas = transactions
    .filter((t) => t.type === "SAIDA")
    .reduce((acc, t) => acc + t.value, 0);

  const saldo = totalEntradas - totalSaidas;

  const handleExportCSV = useCallback(() => {
    exportToCSV(filteredTransactions, selectedMonth, selectedYear);
    toast.success("Exportado como CSV!");
  }, [filteredTransactions, selectedMonth, selectedYear]);

  const handleExportPDF = useCallback(() => {
    exportToPDF(filteredTransactions, selectedMonth, selectedYear);
    toast.success("Exportado como PDF!");
  }, [filteredTransactions, selectedMonth, selectedYear]);

  const averageTransaction = filteredTransactions.length > 0
    ? filteredTransactions.reduce((acc, t) => acc + t.value, 0) / filteredTransactions.length
    : 0;

  // Taxa de economia com limites seguros
  const savingsRate = totalEntradas > 0 
    ? Math.max(-100, Math.min(100, ((totalEntradas - totalSaidas) / totalEntradas) * 100))
    : 0;

  // Percentagem de saídas com verificação de divisão por zero
  const saidasPercentage = totalEntradas > 0 
    ? Math.min(100, (totalSaidas / totalEntradas) * 100)
    : (totalSaidas > 0 ? 100 : 0);

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl">
                <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Dashboard Executive
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-9 sm:ml-11">
              Visão completa e inteligente das suas finanças
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <SelectMes
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthYearChange={handleMonthYearChange}
            />
            <TransactionModal
              onTransactionChange={refreshTransactions}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          </div>
        </motion.div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          <KPICard
            title="Saldo Total"
            value={saldo}
            icon={Wallet}
            color="#3b82f6"
            delay={0}
            trend={{
              value: 12.5,
              isPositive: saldo >= 0,
            }}
          />
          <KPICard
            title="Total Entradas"
            value={totalEntradas}
            icon={ArrowUpCircle}
            color="#10b981"
            delay={0.1}
            percentage={totalEntradas > 0 ? 100 : 0}
          />
          <KPICard
            title="Total Saídas"
            value={totalSaidas}
            icon={ArrowDownCircle}
            color="#ef4444"
            delay={0.2}
            percentage={saidasPercentage}
          />
          <KPICard
            title="Taxa de Economia"
            value={savingsRate}
            icon={PiggyBank}
            color="#8b5cf6"
            delay={0.3}
            prefix=""
            suffix="%"
            percentage={Math.min(Math.abs(savingsRate), 100)}
          />
        </div>

        {/* Transactions Table with Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6 lg:mb-8"
        >
          <Card className="border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 shadow-lg">
            <CardHeader className="p-4 sm:p-5 lg:p-6 pb-3 sm:pb-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg lg:text-xl text-gray-900 dark:text-white">
                      Transações
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                      Filtre e exporte seus dados
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportCSV}
                    disabled={filteredTransactions.length === 0}
                    className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">CSV</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportPDF}
                    disabled={filteredTransactions.length === 0}
                    className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">PDF</span>
                  </Button>
                </div>
              </div>
              
              {/* Filtros */}
              <TransactionFilters
                onFilterChange={handleFilterChange}
                categories={categories}
              />
            </CardHeader>
            
            <CardContent className="pt-0">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                </div>
              ) : filteredTransactions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                    <Wallet className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Nenhuma transação encontrada
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Adicione sua primeira transação para começar
                  </p>
                  <TransactionModal
                    onTransactionChange={refreshTransactions}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                  />
                </motion.div>
              ) : (
                <TableTransactions
                  transactions={filteredTransactions}
                  onTransactionChange={refreshTransactions}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8"
        >
          <Card className="border-gray-200 dark:border-gray-700/50 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900 shadow-lg">
            <CardContent className="p-4 sm:p-5 lg:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-2.5 lg:p-3 bg-blue-500 rounded-lg sm:rounded-xl flex-shrink-0">
                  <Target className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Ticket Médio
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
                    {averageTransaction.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    por transação
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-700/50 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-gray-900 shadow-lg">
            <CardContent className="p-4 sm:p-5 lg:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-2.5 lg:p-3 bg-green-500 rounded-lg sm:rounded-xl flex-shrink-0">
                  <Calendar className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Transações
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    {filteredTransactions.length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    neste período
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-700/50 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-900 shadow-lg sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-5 lg:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-2.5 lg:p-3 bg-purple-500 rounded-lg sm:rounded-xl flex-shrink-0">
                  <TrendingUp className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Margem
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
                    {saldo.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {savingsRate.toFixed(1)}% de economia
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-0"
        >
          <AreaChartV2 transactions={transactions} />
          <DonutChartV2 transactions={transactions} type="SAIDA" />
        </motion.div>
      </div>
    </div>
  );
}
