"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

type Category = {
  id: string;
  name: string;
};

type FilterProps = {
  onFilterChange: (filters: {
    search: string;
    type: string;
    category: string;
  }) => void;
  categories: Category[];
};

export function TransactionFilters({ onFilterChange, categories }: FilterProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Debounce da busca
    const timer = setTimeout(() => {
      onFilterChange({ search, type, category });
    }, 300);

    return () => clearTimeout(timer);
  }, [search, type, category, onFilterChange]);

  const handleClearFilters = () => {
    setSearch("");
    setType("ALL");
    setCategory("ALL");
  };

  const hasActiveFilters = search || type !== "ALL" || category !== "ALL";

  return (
    <div className="space-y-3">
      {/* Barra de busca sempre visível */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Buscar por descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          title="Filtros avançados"
        >
          <Filter className="h-4 w-4" />
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearFilters}
            title="Limpar filtros"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filtros avançados (expansível) */}
      {showFilters && (
        <Card className="p-4 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-slate-700 dark:text-slate-300">
                Tipo de Transação
              </label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas</SelectItem>
                  <SelectItem value="ENTRADA">Apenas Entradas</SelectItem>
                  <SelectItem value="SAIDA">Apenas Saídas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-slate-700 dark:text-slate-300">
                Categoria
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas as Categorias</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Filtros ativos:{" "}
                <span className="font-medium text-slate-900 dark:text-white">
                  {[
                    search && `Busca: "${search}"`,
                    type !== "ALL" && `Tipo: ${type}`,
                    category !== "ALL" && `Categoria: ${category}`,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
