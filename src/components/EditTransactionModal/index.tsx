"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

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

interface EditTransactionModalProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionChange?: () => void;
}

export default function EditTransactionModal({ 
  transaction, 
  open, 
  onOpenChange, 
  onTransactionChange 
}: EditTransactionModalProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(transaction.category.name);
  const [valor, setValor] = useState(
    transaction.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
  );
  const [tipo, setTipo] = useState<Transaction["type"]>(transaction.type);
  const [descricao, setDescricao] = useState(transaction.description);
  const [dataTransacao, setDataTransacao] = useState<Date | undefined>(new Date(transaction.date));

  async function fetchCategorias() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategorias(data);
  }

  useEffect(() => {
    if (open) {
      fetchCategorias();
      // Resetar para os valores da transação
      setCategoriaSelecionada(transaction.category.name);
      setValor(transaction.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 }));
      setTipo(transaction.type);
      setDescricao(transaction.description);
      setDataTransacao(new Date(transaction.date));
    }
  }, [open, transaction]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Converter valor formatado para número
    // Remove o prefixo "R$ " se existir, remove todos os pontos (separadores de milhares) e substitui vírgula por ponto
    const valorLimpo = valor.replace(/R\$\s?/g, "").replace(/\./g, "").replace(",", ".");
    const valorNumerico = parseFloat(valorLimpo);

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      toast.error("Valor inválido. Por favor, insira um valor maior que zero.");
      return;
    }

    if (!dataTransacao) {
      toast.error("Data da transação é obrigatória.");
      return;
    }

    const payload = {
      id: transaction.id,
      description: descricao,
      value: valorNumerico,
      type: tipo,
      category: categoriaSelecionada,
      date: dataTransacao.toISOString(),
    };

    try {
      await api.put("/api/transactions", payload);
      toast.success("Transação atualizada.");
      onOpenChange(false);
      
      if (onTransactionChange) {
        onTransactionChange();
      }
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      toast.error("Erro ao salvar transação.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
        <VisuallyHidden>
          <DialogTitle>Editar Transação</DialogTitle>
        </VisuallyHidden>
        <Card>
          <CardHeader>
            <CardTitle>Editar Transação</CardTitle>
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
                    <button 
                      type="button" 
                      className={cn(
                        "w-full text-left border border-gray-300 p-2 rounded-md flex justify-between items-center",
                        !dataTransacao && "text-muted-foreground"
                      )}
                    >
                      {dataTransacao ? format(dataTransacao, "dd/MM/yyyy") : <span>Escolha a data</span>}
                      <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dataTransacao}
                      onSelect={(date) => setDataTransacao(date)}
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
                  <SelectContent className="hover:cursor-pointer">
                    {categorias.map((c) => (
                      <SelectItem key={c.id} className="hover:cursor-pointer" value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <Select value={tipo} onValueChange={(value) => setTipo(value as "ENTRADA" | "SAIDA")}>
                  <SelectTrigger className="w-full hover:cursor-pointer">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="hover:cursor-pointer">
                    <SelectItem className="hover:cursor-pointer" value="ENTRADA">
                      <ArrowUpCircle className="w-4 h-4" color="green"/>Entrada
                    </SelectItem>
                    <SelectItem className="hover:cursor-pointer" value="SAIDA">
                      <ArrowDownCircle className="w-4 h-4" color="red"/>Saída
                    </SelectItem>
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
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar alterações</Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

