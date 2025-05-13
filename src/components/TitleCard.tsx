
import React from "react";
import { Star, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type TitleType = 'filme' | 'série' | 'novela';
export type CategoryType = 'comédia' | 'terror' | 'romance' | 'ação' | 'drama' | 'ficção' | 'animação' | 'assistir';

export interface TitleCardProps {
  id: string;
  image: string;
  name: string;
  type: TitleType;
  category: CategoryType;
  rating: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TypeColors = {
  filme: 'bg-screentrack-500',
  série: 'bg-red-400',
  novela: 'bg-red-700',
};

const TitleCard: React.FC<TitleCardProps> = ({
  id,
  image,
  name,
  type,
  category,
  rating,
  onEdit,
  onDelete,
}) => {
  // Função para capitalizar a primeira letra
  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className="title-card overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-md">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={image || "/placeholder.svg"} 
          alt={name} 
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 left-2">
          <Badge className={`${TypeColors[type]} text-white`}>
            {capitalize(type)}
          </Badge>
        </div>
        <div className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-1 flex items-center">
          <Star className="h-3 w-3 text-yellow-400 mr-1" />
          <span className="text-xs font-bold text-white">{rating.toFixed(1)}</span>
        </div>
        <div className="card-actions absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex justify-end space-x-2">
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => onEdit(id)}
            className="h-8 rounded-full"
          >
            <Edit className="h-3.5 w-3.5 mr-1" />
            Editar
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={() => onDelete(id)}
            className="h-8 rounded-full"
          >
            <Trash className="h-3.5 w-3.5 mr-1" />
            Excluir
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold leading-tight truncate">{name}</h3>
        <div className="mt-2">
          <Badge variant="secondary">{capitalize(category)}</Badge>
        </div>
      </div>
    </div>
  );
};

export default TitleCard;
