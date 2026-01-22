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
import { ArrowDownCircle, ArrowUpCircle, DollarSign, Download, FileText, TrendingUp, Wallet, PiggyBank, Sparkles } from "lucide-react";
import Link from "next/link";
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
import { motion } from "framer-motion";
import CountUp from "react-countup";

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
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header do Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 ml-[-4px]"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-1 flex items-center gap-3 text-gray-900 dark:text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-orange-500 shadow-lg">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            Dashboard Financeiro
          </h1>
          <p className="text-gray-600 dark:text-gray-400 ml-[52px]">
            Controle total das suas finanças em um só lugar
          </p>
        </motion.div>
        {/* Controles Principais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50">
            <CardContent className="p-4">
              <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <SelectMes
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    onMonthYearChange={handleMonthYearChange}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportCSV}
                    disabled={filteredTransactions.length === 0}
                    className="hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-600 dark:hover:text-green-400 hover:border-green-300 transition-all duration-200"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportPDF}
                    disabled={filteredTransactions.length === 0}
                    className="hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 transition-all duration-200"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <TransactionModal 
                    onTransactionChange={refreshTransactions}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                  />
                </div>
              </section>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cards de métricas - Versão Premium */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Card de Entradas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white transition-all duration-300 hover:shadow-2xl">
              {/* Ícone decorativo de fundo */}
              <div className="absolute -right-8 -top-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="w-32 h-32" />
              </div>
              
              <CardHeader className="relative z-10 pb-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <ArrowUpCircle className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <CardTitle className="text-xs font-medium text-green-100">
                      Entradas
                    </CardTitle>
                    <p className="text-[10px] text-green-200 mt-0.5">
                      Receitas do mês
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 pt-0">
                <p className="text-2xl md:text-3xl font-bold tracking-tight">
                  R$ <CountUp end={entradaTotal} decimals={2} decimal="," separator="." duration={1.5} />
                </p>
                <p className="text-xs text-green-100 mt-1">
                  {transactions.filter(t => t.type === "ENTRADA").length} transações
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card de Saídas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-red-500 to-rose-600 text-white transition-all duration-300 hover:shadow-2xl">
              {/* Ícone decorativo de fundo */}
              <div className="absolute -right-8 -top-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <ArrowDownCircle className="w-32 h-32" />
              </div>
              
              <CardHeader className="relative z-10 pb-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <ArrowDownCircle className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <CardTitle className="text-xs font-medium text-red-100">
                      Saídas
                    </CardTitle>
                    <p className="text-[10px] text-red-200 mt-0.5">
                      Despesas do mês
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 pt-0">
                <p className="text-2xl md:text-3xl font-bold tracking-tight">
                  R$ <CountUp end={saidaTotal} decimals={2} decimal="," separator="." duration={1.5} />
                </p>
                <p className="text-xs text-red-100 mt-1">
                  {transactions.filter(t => t.type === "SAIDA").length} transações
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card de Saldo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className={`relative overflow-hidden border-0 shadow-lg text-white transition-all duration-300 hover:shadow-2xl ${
              saldo >= 0 
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                : 'bg-gradient-to-br from-orange-500 to-red-600'
            }`}>
              {/* Ícone decorativo de fundo */}
              <div className="absolute -right-8 -top-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <PiggyBank className="w-32 h-32" />
              </div>
              
              <CardHeader className="relative z-10 pb-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <PiggyBank className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <CardTitle className="text-xs font-medium text-blue-100">
                      Saldo
                    </CardTitle>
                    <p className="text-[10px] text-blue-200 mt-0.5">
                      {saldo >= 0 ? 'Positivo' : 'Negativo'}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 pt-0">
                <p className="text-2xl md:text-3xl font-bold tracking-tight">
                  R$ <CountUp end={saldo} decimals={2} decimal="," separator="." duration={1.5} />
                </p>
                <p className="text-xs text-blue-100 mt-1">
                  {saldo >= 0 ? '🎉 Economia garantida!' : '⚠️ Atenção aos gastos'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Gráficos */}
        {!loading && transactions.length > 0 && (
          <>
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <TransactionChart transactions={transactions} />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CategoryPieChart transactions={transactions} type="SAIDA" />
              </motion.div>
            </motion.section>
            
            {/* Relatório Detalhado por Categoria */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4"
            >
              <CategoryReport transactions={transactions} />
            </motion.section>
          </>
        )}

        {/* Filtros e Tabela de transações */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6"
        >
          <Card className="border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700/50 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    Transações do Mês
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {filteredTransactions.length !== transactions.length ? (
                      <span>
                        Mostrando <strong>{filteredTransactions.length}</strong> de{" "}
                        <strong>{transactions.length}</strong> transações
                      </span>
                    ) : (
                      <span>
                        Total de <strong>{transactions.length}</strong> transações
                      </span>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4">
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
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4">
                    <Wallet className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Nenhuma transação ainda
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Comece a controlar suas finanças adicionando sua primeira transação
                  </p>
                  <TransactionModal 
                    onTransactionChange={refreshTransactions}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                  />
                </motion.div>
              ) : filteredTransactions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-4">
                    <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Nenhum resultado encontrado
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tente ajustar os filtros de busca para ver mais resultados
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <TableTransactions
                    transactions={filteredTransactions}
                    onTransactionChange={refreshTransactions}
                  />
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
