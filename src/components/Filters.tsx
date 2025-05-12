
import React from "react";
import { TitleType, CategoryType } from "./TitleCard";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="mb-6 py-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <div className="flex items-center mr-2">
          <Filter className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>
        
        <div className="flex-shrink-0">
          <Button
            onClick={() => {
              setTypeFilter(null);
              setCategoryFilter(null);
            }}
            variant="outline"
            size="sm"
            className={cn(
              "rounded-full text-xs",
              !typeFilter && !categoryFilter ? "bg-primary text-white hover:bg-primary/90" : ""
            )}
          >
            Todos
          </Button>
        </div>
        
        {types.map((type) => (
          <div className="flex-shrink-0" key={type}>
            <Button
              onClick={() => setTypeFilter(type)}
              variant="outline"
              size="sm"
              className={cn(
                "rounded-full text-xs",
                typeFilter === type ? "bg-primary text-white hover:bg-primary/90" : ""
              )}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          </div>
        ))}
        
        {categories.map((category) => (
          <div className="flex-shrink-0" key={category}>
            <Button
              onClick={() => setCategoryFilter(category)}
              variant="outline"
              size="sm"
              className={cn(
                "rounded-full text-xs",
                categoryFilter === category ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : ""
              )}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filters;
