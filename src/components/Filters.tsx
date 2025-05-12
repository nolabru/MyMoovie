
import React from "react";
import { TitleType, CategoryType } from "./TitleCard";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Filter } from "lucide-react";

interface FiltersProps {
  typeFilter: TitleType | null;
  setTypeFilter: (type: TitleType | null) => void;
  categoryFilter: CategoryType | null;
  setCategoryFilter: (category: CategoryType | null) => void;
}

const types: TitleType[] = ['filme', 'série', 'novela'];
const categories: CategoryType[] = ['comédia', 'terror', 'romance', 'ação', 'drama', 'ficção', 'animação'];

const Filters: React.FC<FiltersProps> = ({
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filtros:</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="typeFilter" className="text-sm font-medium mb-1 block">
            Tipo
          </label>
          <Select
            value={typeFilter || "all"}
            onValueChange={(value) => setTypeFilter(value === "all" ? null : value as TitleType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="categoryFilter" className="text-sm font-medium mb-1 block">
            Categoria
          </label>
          <Select
            value={categoryFilter || "all"}
            onValueChange={(value) => setCategoryFilter(value === "all" ? null : value as CategoryType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
