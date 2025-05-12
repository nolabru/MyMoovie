import React, { useState } from "react";
import TitleCard from "@/components/TitleCard";
import Filters from "@/components/Filters";
import { useNavigate } from "react-router-dom";
import { TitleType, CategoryType } from "@/components/TitleCard";
import { useTitles } from "@/contexts/TitlesContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";

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
    loading: authLoading
  } = useAuth();
  const [typeFilter, setTypeFilter] = useState<TitleType | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryType | null>(null);

  // Filter out titles with 'assistir' category unless specifically filtered
  const activeTitles = titles.filter(title => {
    // Basic filters (deleted status and search query)
    const baseFilter = !title.deleted && 
      (searchQuery === "" || title.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Type filter
    const typeFilterMatch = typeFilter === null || title.type === typeFilter;
    
    // Category filter - only show 'assistir' category when specifically selected
    const categoryFilterMatch = 
      // When a specific category is selected, show only those titles
      (categoryFilter !== null && title.category === categoryFilter) ||
      // When no category filter is applied, hide 'assistir' category titles
      (categoryFilter === null && title.category !== 'assistir');
    
    return baseFilter && typeFilterMatch && categoryFilterMatch;
  });

  const handleEdit = (id: string) => {
    navigate(`/editar/${id}`);
  };
  const handleDelete = (id: string) => {
    deleteTitle(id);
    toast.success("Título movido para a lixeira");
  };
  const handleAddTitle = () => {
    if (!user) {
      toast.error("Você precisa estar logado para adicionar títulos");
      navigate("/login");
      return;
    }
    navigate("/adicionar");
  };
  const loading = authLoading || titlesLoading;
  
  return <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Seus Títulos</h1>
        <Button onClick={handleAddTitle}>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar Título
        </Button>
      </div>

      <Filters typeFilter={typeFilter} setTypeFilter={setTypeFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />

      {loading ? <div className="text-center py-10">
          <p className="text-muted-foreground">Carregando...</p>
        </div> : !user ? <div className="text-center py-10 mt-20">
          <h3 className="text-xl font-medium text-muted-foreground mb-4">
            Faça login para visualizar seus títulos
          </h3>
          <p className="text-muted-foreground mb-6">
            Você precisa estar logado para gerenciar seus filmes, séries e novelas.
          </p>
          <Button onClick={() => navigate("/login")}>
            <User className="h-4 w-4 mr-1" />
            Fazer Login
          </Button>
        </div> : activeTitles.length === 0 ? <div className="text-center py-10">
          <h3 className="text-xl font-medium text-muted-foreground mb-4">
            Nenhum título encontrado
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || typeFilter || categoryFilter ? "Tente ajustar os filtros ou a busca" : "Adicione seu primeiro título clicando no botão 'Adicionar'"}
          </p>
        </div> : <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {activeTitles.map(title => <TitleCard key={title.id} id={title.id} name={title.name} type={title.type as TitleType} category={title.category as CategoryType} rating={title.rating} image={title.image} onEdit={handleEdit} onDelete={handleDelete} />)}
        </div>}
    </div>;
};

export default Home;
