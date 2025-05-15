
import React from "react";
import { TitleType, CategoryType } from "./TitleCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import { useCategories, Category } from "@/hooks/use-categories";

type SortOption = "name_asc" | "name_desc" | "rating_asc" | "rating_desc" | null;

interface FiltersProps {
  typeFilter: TitleType | null;
  setTypeFilter: (type: TitleType | null) => void;
  categoryFilter: CategoryType | null;
  setCategoryFilter: (category: CategoryType | null) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

const types: TitleType[] = ['filme', 'série', 'novela'];

const Filters: React.FC<FiltersProps> = ({
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  sortOption,
  setSortOption
}) => {
  const { categories, loading } = useCategories();
  
  return <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="typeFilter" className="text-sm font-medium mb-1 block">
            Tipo
          </label>
          <Select value={typeFilter || "all"} onValueChange={value => setTypeFilter(value === "all" ? null : value as TitleType)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {types.map(type => <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="categoryFilter" className="text-sm font-medium mb-1 block">
            Categoria
          </label>
          <Select value={categoryFilter || "all"} onValueChange={value => setCategoryFilter(value === "all" ? null : value as CategoryType)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {loading ? (
                <SelectItem value="loading" disabled>Carregando...</SelectItem>
              ) : (
                categories.map(category => (
                  <SelectItem key={category.id} value={category.name as CategoryType}>
                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="sortOption" className="text-sm font-medium mb-1 block">
            Ordenação
          </label>
          <Select value={sortOption || "none"} onValueChange={value => setSortOption(value === "none" ? null : value as SortOption)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Ordenação padrão" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Ordenação padrão</SelectItem>
              <SelectItem value="name_asc">Nome (A-Z) <ArrowUpAZ className="inline-block ml-1 h-4 w-4" /></SelectItem>
              <SelectItem value="name_desc">Nome (Z-A) <ArrowDownAZ className="inline-block ml-1 h-4 w-4" /></SelectItem>
              <SelectItem value="rating_asc">Nota (menor para maior)</SelectItem>
              <SelectItem value="rating_desc">Nota (maior para menor)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>;
};

export default Filters;
