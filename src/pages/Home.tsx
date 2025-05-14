
import React, { useState } from "react";
import TitleCard from "@/components/TitleCard";
import Filters from "@/components/Filters";
import { useNavigate } from "react-router-dom";
import { TitleType, CategoryType } from "@/components/TitleCard";
import { useTitles } from "@/contexts/TitlesContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type SortOption = "name_asc" | "name_desc" | "rating_asc" | "rating_desc" | null;

const Home: React.FC<{
  searchQuery?: string;
}> = ({
  searchQuery = ""
}) => {
  const navigate = useNavigate();
  const {
    titles,
    deleteTitle,
    loading: titlesLoading
  } = useTitles();
  const {
    user,
    isAdmin,
    loading: authLoading
  } = useAuth();
  const [typeFilter, setTypeFilter] = useState<TitleType | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryType | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>(null);

  // Filter out titles with 'assistir' category unless specifically filtered
  const activeTitles = titles.filter(title => {
    // Basic filters (deleted status and search query)
    const baseFilter = !title.deleted && (searchQuery === "" || title.name.toLowerCase().includes(searchQuery.toLowerCase()));

    // Type filter
    const typeFilterMatch = typeFilter === null || title.type === typeFilter;

    // Category filter - only show 'assistir' category when specifically selected
    const categoryFilterMatch =
    // When a specific category is selected, show only those titles
    categoryFilter !== null && title.category === categoryFilter ||
    // When no category filter is applied, hide 'assistir' category titles
    categoryFilter === null && title.category !== 'assistir';
    return baseFilter && typeFilterMatch && categoryFilterMatch;
  }).sort((a, b) => {
    // Apply sorting
    if (sortOption === "name_asc") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "name_desc") {
      return b.name.localeCompare(a.name);
    } else if (sortOption === "rating_asc") {
      return a.rating - b.rating;
    } else if (sortOption === "rating_desc") {
      return b.rating - a.rating;
    }
    return 0;
  });

  const handleEdit = (id: string) => {
    navigate(`/editar/${id}`);
  };

  const handleDelete = (id: string) => {
    deleteTitle(id);
    toast.success("Título movido para a lixeira");
  };

  const isLoading = authLoading || titlesLoading;

  return <div className="container mx-auto py-6 px-4">
      <Filters typeFilter={typeFilter} setTypeFilter={setTypeFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} sortOption={sortOption} setSortOption={setSortOption} />

      {isLoading ? <div className="text-center py-10">
          <p className="text-muted-foreground">Carregando...</p>
        </div> : !user ? <div className="text-center py-10 mt-20">
          <h3 className="text-xl font-medium text-muted-foreground mb-4">
            Faça login para visualizar seus títulos
          </h3>
          <p className="text-muted-foreground mb-6">
            Você precisa estar logado para gerenciar seus filmes, séries e novelas.
          </p>
        </div> : activeTitles.length === 0 ? <div className="text-center py-10">
          <h3 className="text-xl font-medium text-muted-foreground mb-4">
            Nenhum título encontrado
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || typeFilter || categoryFilter || sortOption ? "Tente ajustar os filtros ou a busca" : "Adicione seu primeiro título clicando no botão 'Adicionar'"}
          </p>
        </div> : <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {activeTitles.map(title => <TitleCard key={title.id} id={title.id} name={title.name} type={title.type as TitleType} category={title.category as CategoryType} rating={title.rating} image={title.image} onEdit={handleEdit} onDelete={handleDelete} />)}
        </div>}
    </div>;
};

export default Home;
