
"use client"
import { ArrowDownCircle, ArrowUpCircle, PencilIcon, Trash2Icon } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation"
import { useState } from "react";
import EditTransactionModal from "../EditTransactionModal";

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

export default function TableTransactions( { transactions, onTransactionChange }: {transactions: Transaction[], onTransactionChange?: () => void}) {

    const router = useRouter();
   const [editModalOpen, setEditModalOpen] = useState(false);
const [transactionEdit, setTransactionEdit] = useState<Transaction | undefined>(undefined);

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

    
return(
<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Data
                </th>
                <th scope="col" className="px-6 py-3">
                    Descrição
                </th>
                <th scope="col" className="px-6 py-3">
                    Categoria
                </th>
                <th scope="col" className="px-6 py-3">
                    Tipo
                </th>
                <th scope="col" className="px-6 py-3">
                    Valor
                </th>
                <th scope="col" className="px-6 py-3">
                    Ações
                </th>
            </tr>
        </thead>
        <tbody>
           
            {transactions.map((t) => (
                
                <tr key={t.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   {new Date(t.date).toLocaleDateString("pt-BR")}
                </th>
                <td className="px-6 py-4 whitespace-nowrap">
                   {t.description}
                </td>
                <td className="px-6 py-{4">
                   {t.category?.name || "-"}
                </td>
                <td className="px-6 py-4">
                   {t.type === "ENTRADA" ? (
                    <ArrowUpCircle className="w-4 h-4" color="green" />
                    ) : (
                    <ArrowDownCircle className="w-4 h-4" color="red" />
                    )}
                </td>
                <td className="px-6 py-4">
                    {t.value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        })}
                </td>
                <td className="px-6 py-4">
                    <button className="hover:cursor-pointer mr-2" onClick={() => handleDeleteTransaction(t.id)}>
                        <Trash2Icon className="w-4 h-4" color="red"/>
                    </button>
                   <button className="hover:cursor-pointer" onClick={() => handleEditTransaction(t)}>
                    <PencilIcon className="w-4 h-4" color="gray" />
                    </button>
                </td>
            </tr>
            


            
            ))}
            
           
        </tbody>
    </table>
    
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