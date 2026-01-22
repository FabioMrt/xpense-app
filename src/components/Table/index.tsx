
"use client"
import { ArrowDownCircle, ArrowUpCircle, PencilIcon, Trash2Icon, ChevronDown } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation"
import { useState } from "react";
import EditTransactionModal from "../EditTransactionModal";
import { Button } from "@/components/ui/button";

export type Transaction = {
  id: string;
  description: string;
  value: number;
  type: "ENTRADA" | "SAIDA";
  category: {
    name: string;
  } | null;
  date: Date; // <- aqui estava como string, mude para Date
};

const ITEMS_PER_PAGE_MOBILE = 10; // Número de cards por página no mobile

export default function TableTransactions( { transactions, onTransactionChange }: {transactions: Transaction[], onTransactionChange?: () => void}) {

    const router = useRouter();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [transactionEdit, setTransactionEdit] = useState<Transaction | undefined>(undefined);
    const [mobilePageSize, setMobilePageSize] = useState(ITEMS_PER_PAGE_MOBILE);

    async function handleDeleteTransaction(id: string) {
        try {
            await api.delete(`/api/transactions?id=${id}`);
            toast.success("Transação excluída com sucesso.");
            
            // Chama o callback para atualizar a lista
            if (onTransactionChange) {
              onTransactionChange();
            } else {
              router.refresh();
            }
                 
        } catch (error) {
            console.error("Erro ao deletar:", error);
    toast.error("Erro ao deletar transação");
        }

    }

    function handleEditTransaction(transaction: Transaction) {
        setTransactionEdit(transaction);
        setEditModalOpen(true);
    }

    function handleEditClose() {
        setEditModalOpen(false);
        setTransactionEdit(undefined);
        
        // Atualiza a lista após edição
        if (onTransactionChange) {
            onTransactionChange();
        }
    }
    
    function handleEditModalChange(open: boolean) {
        setEditModalOpen(open);
        if (!open) {
            setTransactionEdit(undefined);
        }
    }

    
// Calcular transações visíveis no mobile
const visibleTransactionsMobile = transactions.slice(0, mobilePageSize);
const hasMoreTransactions = transactions.length > mobilePageSize;
const remainingTransactions = transactions.length - mobilePageSize;

const handleLoadMore = () => {
    setMobilePageSize(prev => Math.min(prev + ITEMS_PER_PAGE_MOBILE, transactions.length));
};

const handleShowLess = () => {
    setMobilePageSize(ITEMS_PER_PAGE_MOBILE);
    // Scroll suave para o topo da lista
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

return(
<div className="w-full">
    {/* Vista Mobile - Cards Empilhados com Paginação */}
    <div className="block lg:hidden">
        {/* Contador de Transações */}
        {transactions.length > 0 && (
            <div className="mb-3 px-1">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                    Exibindo <span className="font-semibold text-gray-900 dark:text-white">{visibleTransactionsMobile.length}</span> de <span className="font-semibold text-gray-900 dark:text-white">{transactions.length}</span> transações
                </p>
            </div>
        )}

        <div className="space-y-3">
            {visibleTransactionsMobile.map((t) => (
            <div
                key={t.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
                {/* Header do Card - Data e Tipo */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        {t.type === "ENTRADA" ? (
                            <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <ArrowUpCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                        ) : (
                            <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <ArrowDownCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </div>
                        )}
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            {new Date(t.date).toLocaleDateString("pt-BR")}
                        </span>
                    </div>
                    <span className={`text-lg font-bold ${
                        t.type === "ENTRADA" 
                            ? "text-green-600 dark:text-green-400" 
                            : "text-red-600 dark:text-red-400"
                    }`}>
                        {t.value.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </span>
                </div>

                {/* Corpo do Card - Informações */}
                <div className="space-y-2 mb-3">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Descrição</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {t.description}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Categoria</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            {t.category?.name || "Sem categoria"}
                        </p>
                    </div>
                </div>

                {/* Footer do Card - Ações */}
                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => handleEditTransaction(t)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                    >
                        <PencilIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Editar</span>
                    </button>
                    <button
                        onClick={() => handleDeleteTransaction(t.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                    >
                        <Trash2Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">Excluir</span>
                    </button>
                </div>
            </div>
        ))}
        </div>

        {/* Botões de Paginação Mobile */}
        {transactions.length > ITEMS_PER_PAGE_MOBILE && (
            <div className="mt-4 flex flex-col gap-2">
                {hasMoreTransactions && (
                    <Button
                        onClick={handleLoadMore}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <ChevronDown className="h-4 w-4" />
                        <span className="font-medium">
                            Carregar mais {remainingTransactions > ITEMS_PER_PAGE_MOBILE ? ITEMS_PER_PAGE_MOBILE : remainingTransactions} transações
                        </span>
                    </Button>
                )}
                
                {mobilePageSize > ITEMS_PER_PAGE_MOBILE && (
                    <Button
                        onClick={handleShowLess}
                        variant="ghost"
                        className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        Mostrar menos
                    </Button>
                )}
            </div>
        )}
    </div>

    {/* Vista Desktop - Tabela Tradicional */}
    <div className="hidden lg:block relative overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">Data</th>
                    <th scope="col" className="px-6 py-3">Descrição</th>
                    <th scope="col" className="px-6 py-3">Categoria</th>
                    <th scope="col" className="px-6 py-3">Tipo</th>
                    <th scope="col" className="px-6 py-3">Valor</th>
                    <th scope="col" className="px-6 py-3">Ações</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((t) => (
                    <tr 
                        key={t.id} 
                        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {new Date(t.date).toLocaleDateString("pt-BR")}
                        </th>
                        <td className="px-6 py-4">
                            <span className="line-clamp-2">{t.description}</span>
                        </td>
                        <td className="px-6 py-4">
                            {t.category?.name || "-"}
                        </td>
                        <td className="px-6 py-4">
                            {t.type === "ENTRADA" ? (
                                <div className="flex items-center gap-1">
                                    <ArrowUpCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Entrada</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <ArrowDownCircle className="w-4 h-4 text-red-500" />
                                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">Saída</span>
                                </div>
                            )}
                        </td>
                        <td className="px-6 py-4">
                            <span className={`font-semibold ${
                                t.type === "ENTRADA" 
                                    ? "text-green-600 dark:text-green-400" 
                                    : "text-red-600 dark:text-red-400"
                            }`}>
                                {t.value.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEditTransaction(t)}
                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                    title="Editar"
                                >
                                    <PencilIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </button>
                                <button
                                    onClick={() => handleDeleteTransaction(t.id)}
                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                    title="Excluir"
                                >
                                    <Trash2Icon className="w-4 h-4 text-red-600 dark:text-red-400" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    
    {/* Modal de edição */}
    {transactionEdit && transactionEdit.category && (
        <EditTransactionModal 
            transaction={{
                ...transactionEdit,
                category: transactionEdit.category,
                date: new Date(transactionEdit.date).toISOString()
            }}
            open={editModalOpen}
            onOpenChange={handleEditModalChange}
            onTransactionChange={handleEditClose}
        />
    )}
</div>
)
}