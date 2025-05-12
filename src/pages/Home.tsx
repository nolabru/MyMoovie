import React, { useState } from "react";
import TitleCard from "@/components/TitleCard";
import Filters from "@/components/Filters";
import { useNavigate } from "react-router-dom";
import { TitleType, CategoryType } from "@/components/TitleCard";
import { useTitles } from "@/contexts/TitlesContext";
import { toast } from "sonner";
const Home: React.FC<{
  searchQuery?: string;
}> = ({
  searchQuery = ""
}) => {
  const navigate = useNavigate();
  const {
    titles,
    deleteTitle
  } = useTitles();
  const [typeFilter, setTypeFilter] = useState<TitleType | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryType | null>(null);
  const activeTitles = titles.filter(title => !title.deleted && (searchQuery === "" || title.name.toLowerCase().includes(searchQuery.toLowerCase())) && (typeFilter === null || title.type === typeFilter) && (categoryFilter === null || title.category === categoryFilter));
  const handleEdit = (id: string) => {
    navigate(`/editar/${id}`);
  };
  const handleDelete = (id: string) => {
    deleteTitle(id);
    toast.success("Título movido para a lixeira");
  };
  return <div className="container mx-auto py-6 px-4">
      
      
      <Filters typeFilter={typeFilter} setTypeFilter={setTypeFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />
      
      {activeTitles.length === 0 ? <div className="text-center py-10">
          <h3 className="text-xl font-medium text-muted-foreground mb-4">
            Nenhum título encontrado
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || typeFilter || categoryFilter ? "Tente ajustar os filtros ou a busca" : "Adicione seu primeiro título clicando no botão 'Adicionar'"}
          </p>
        </div> : <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeTitles.map(title => <TitleCard key={title.id} id={title.id} name={title.name} type={title.type} category={title.category} rating={title.rating} image={title.image} onEdit={handleEdit} onDelete={handleDelete} />)}
        </div>}
    </div>;
};
export default Home;