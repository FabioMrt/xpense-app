"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useMemo } from "react";

interface SelectMesProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthYearChange: (month: number, year: number) => void;
}

const nomesMeses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function SelectMes({ selectedMonth, selectedYear, onMonthYearChange }: SelectMesProps) {
  
  // Gera opções: 4 meses anteriores + atual + 1 posterior
  const monthOptions = useMemo(() => {
    const options = [];
    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    // Adiciona 4 meses anteriores, atual e 1 posterior
    for (let i = -4; i <= 1; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const month = date.getMonth() + 1; // getMonth() retorna 0-11
      const year = date.getFullYear();
      
      options.push({
        label: `${nomesMeses[date.getMonth()]} ${year}`,
        value: `${year}-${month}`,
        month,
        year
      });
    }
    
    return options;
  }, []);

  function handleChange(value: string) {
    const [year, month] = value.split("-").map(Number);
    onMonthYearChange(month, year);
  }

  const currentValue = `${selectedYear}-${selectedMonth}`;

  return (
    <Select value={currentValue} onValueChange={handleChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Selecione o período" />
      </SelectTrigger>
      <SelectContent>
        {monthOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}