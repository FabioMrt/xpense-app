"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, PencilIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  VisuallyHidden,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import CurrencyInput from 'react-currency-input-field';

import { api } from "@/lib/api";
import { useRouter } from "next/navigation"

import { toast } from "sonner"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"



type Categoria = {
  id: string,
  name: string
}

type Transaction = {
id: string;
description: string;
value: number;
type: "ENTRADA" | "SAIDA";
category: { name: string };
date: string;
};

type Props = {
transaction?: Transaction;
onTransactionChange?: () => void;
};


export default function TransactionModal({ transaction, onTransactionChange }: Props) {
  const [open, setOpen] = useState(false);
const [categorias, setCategorias] = useState<Categoria[]>([]);
const [categoriaSelecionada, setCategoriaSelecionada] = useState(transaction?.category.name || "");
const [valor, setValor] = useState(
transaction ? transaction.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : ""
);
const [tipo, setTipo] = useState<Transaction["type"]>(transaction?.type || "ENTRADA");
const [descricao, setDescricao] = useState(transaction?.description || "");
const [dataTransacao, setDataTransacao] = useState<Date | undefined>(
transaction ? new Date(transaction.date) : new Date()
);

  

  async function fetchCategorias() {
    const res = await fetch("/api/categories");
    const data = await res.json();

    setCategorias(data);
  }


 useEffect(() => {
  if (open) {
    // Buscar categorias sempre que abrir o modal
    fetchCategorias();
    
    if (!transaction) {
      // Resetar campos apenas ao abrir para uma nova transação (criação)
      setDescricao("");
      setValor("");
      setTipo("ENTRADA");
      setCategoriaSelecionada("");
      setDataTransacao(new Date());
    }
  }
}, [open, transaction]);


  const router = useRouter();

    async function handleSubmit(e: FormEvent) {
    e.preventDefault();


    const payload = {
    description: descricao,
    value: parseFloat(valor.replace(".", "").replace(",", ".")),
    type: tipo,
    category: categoriaSelecionada,
    date: dataTransacao?.toISOString(),
    };


    try {
    if (transaction) {
    await api.put("/api/transactions", { ...payload, id: transaction.id });
    toast.success("Transação atualizada.");
    } else {
    await api.post("/api/transactions", payload);
    toast.success("Transação adicionada.");
    }

    setOpen(false);
    
    // Chama o callback para atualizar a lista
    if (onTransactionChange) {
      onTransactionChange();
    } else {
      router.refresh();
    }
    } catch (error) {
    console.error("Erro ao salvar transação:", error);
    toast.error("Erro ao salvar transação.");
    }
    }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hover:cursor-pointer">
         <PlusIcon className="mr-2" />
        Adicionar transação
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
        <VisuallyHidden>
          <DialogTitle>{transaction ? "Editar Transação" : "Nova Transação"}</DialogTitle>
        </VisuallyHidden>
        <Card>
          <CardHeader>
            <CardTitle>{transaction ? "Editar Transação" : "Nova Transação"}</CardTitle>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Data da transação:</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button type="button" className={cn( "w-full text-left border border-gray-300 p-2 rounded-md flex justify-between items-center",
          !dataTransacao && "text-muted-foreground")}>
            {dataTransacao ? format(dataTransacao, "dd/MM/yyyy") : <span>Escolha a data</span>}
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
          </button>
                  </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dataTransacao}
              onSelect={setDataTransacao}
              initialFocus
            />
          </PopoverContent>
                </Popover>
              </div>

              

              <div>
                <label className="block text-sm font-medium mb-1">Categoria</label>
                <Select value={categoriaSelecionada} onValueChange={setCategoriaSelecionada}>
                <SelectTrigger className="w-full hover:cursor-pointer">
                    <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent className="hover:cursor-pointer ">
                   {categorias.map((c) => (
                     <SelectItem key={c.id} className="hover:cursor-pointer" value={c.name}>{c.name}</SelectItem>
                   
                   ))}
                    
                </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Tipo
                </label>
                
                <Select value={tipo} onValueChange={(value) => setTipo(value as "ENTRADA" | "SAIDA")}>
                <SelectTrigger className="w-full hover:cursor-pointer">
                    <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="hover:cursor-pointer ">
                    <SelectItem className="hover:cursor-pointer" value="ENTRADA"><ArrowUpCircle className="w-4 h-4" color="green"/>Entrada</SelectItem>
                    <SelectItem className="hover:cursor-pointer" value="SAIDA"><ArrowDownCircle className="w-4 h-4" color="red"/>Saída</SelectItem>
                    
                </SelectContent>
                </Select>
                
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valor</label>
                <CurrencyInput
                name="value"
                placeholder="R$ 0,00"
                decimalsLimit={2}
                decimalSeparator=","
                groupSeparator="."
                prefix="R$ "
                value={valor}
                onValueChange={(value) => setValor(value || "")}
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              />
              </div>
          
          

          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">{transaction ? "Salvar alterações" : "Salvar"}</Button>
          </CardFooter>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}