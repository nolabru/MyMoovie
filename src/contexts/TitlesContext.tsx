
import React, { createContext, useContext, useState, useEffect } from "react";
import { TitleType, CategoryType } from "@/components/TitleCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export interface Title {
  id: string;
  name: string;
  type: TitleType;
  category: CategoryType;
  rating: number;
  image: string;
  deleted: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface TitlesContextType {
  titles: Title[];
  loading: boolean;
  addTitle: (title: Omit<Title, "id" | "deleted" | "user_id">, imageFile?: File) => Promise<void>;
  updateTitle: (id: string, title: Partial<Title>, imageFile?: File) => Promise<void>;
  deleteTitle: (id: string) => Promise<void>;
  restoreTitle: (id: string) => Promise<void>;
  permanentlyDeleteTitle: (id: string) => Promise<void>;
  getTitleById: (id: string) => Title | undefined;
}

const TitlesContext = createContext<TitlesContextType | undefined>(undefined);

export const TitlesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState<number | null>(null);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const { user } = useAuth();

  // Função para buscar títulos com debounce
  const fetchTitles = async () => {
    // Evita requisições simultâneas
    if (requestInProgress) return;
    
    // Se já buscou dados nos últimos 2 segundos, ignora
    const now = Date.now();
    if (lastFetched && now - lastFetched < 2000) return;
    
    if (!user) {
      setTitles([]);
      setLoading(false);
      return;
    }

    try {
      setRequestInProgress(true);
      setLoading(true);
      
      const { data, error } = await supabase
        .from('titles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Converter os dados recebidos para o tipo Title
      const typedData = data?.map(item => ({
        ...item,
        type: item.type as TitleType,
        category: item.category as CategoryType,
        image: item.image || ''
      })) || [];
      
      setTitles(typedData);
      setLastFetched(now);
    } catch (error: any) {
      console.error('Erro ao carregar títulos:', error.message);
      toast.error('Erro ao carregar títulos');
    } finally {
      setLoading(false);
      setRequestInProgress(false);
    }
  };

  // Carregar títulos do usuário atual
  useEffect(() => {
    // Reset states on auth change
    setTitles([]);
    setLoading(true);
    setLastFetched(null);
    
    // Fetch titles if user exists
    if (user) {
      fetchTitles();
    } else {
      setLoading(false);
    }
  }, [user?.id]); // Só executa quando o ID do usuário muda

  // Upload de imagem
  const uploadImage = async (file: File): Promise<string> => {
    const fileName = `${Math.random().toString(36).substring(2)}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('title_images')
      .upload(`public/${fileName}`, file);
    
    if (error) {
      throw error;
    }
    
    const { data: urlData } = supabase.storage
      .from('title_images')
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  };

  // Adicionar título
  const addTitle = async (title: Omit<Title, "id" | "deleted" | "user_id">, imageFile?: File) => {
    if (!user) {
      toast.error("É necessário estar logado para adicionar títulos");
      return;
    }
    
    try {
      let imageUrl = title.image;
      
      // Se tiver um arquivo de imagem, fazer upload
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      const newTitle = {
        ...title,
        image: imageUrl,
        user_id: user.id,
      };
      
      const { data, error } = await supabase
        .from('titles')
        .insert([newTitle])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const addedTitle = {
          ...data[0],
          type: data[0].type as TitleType,
          category: data[0].category as CategoryType,
          image: data[0].image || ''
        };
        
        setTitles([addedTitle, ...titles]);
      }
    } catch (error: any) {
      console.error('Erro ao adicionar título:', error.message);
      toast.error('Erro ao adicionar título');
      throw error;
    }
  };

  // Atualizar título
  const updateTitle = async (id: string, updatedFields: Partial<Title>, imageFile?: File) => {
    if (!user) {
      toast.error("É necessário estar logado para editar títulos");
      return;
    }
    
    try {
      let updates = { ...updatedFields };
      
      // Se tiver um arquivo de imagem, fazer upload
      if (imageFile) {
        const imageUrl = await uploadImage(imageFile);
        updates.image = imageUrl;
      }
      
      const { error } = await supabase
        .from('titles')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setTitles(
        titles.map((title) =>
          title.id === id ? { ...title, ...updates } : title
        )
      );
    } catch (error: any) {
      console.error('Erro ao atualizar título:', error.message);
      toast.error('Erro ao atualizar título');
      throw error;
    }
  };

  // Marcar como excluído (soft delete)
  const deleteTitle = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('titles')
        .update({ deleted: true })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setTitles(
        titles.map((title) =>
          title.id === id ? { ...title, deleted: true } : title
        )
      );
    } catch (error: any) {
      console.error('Erro ao excluir título:', error.message);
      toast.error('Erro ao excluir título');
    }
  };

  // Restaurar título
  const restoreTitle = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('titles')
        .update({ deleted: false })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setTitles(
        titles.map((title) =>
          title.id === id ? { ...title, deleted: false } : title
        )
      );
    } catch (error: any) {
      console.error('Erro ao restaurar título:', error.message);
      toast.error('Erro ao restaurar título');
    }
  };

  // Excluir permanentemente
  const permanentlyDeleteTitle = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('titles')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setTitles(titles.filter((title) => title.id !== id));
    } catch (error: any) {
      console.error('Erro ao excluir permanentemente título:', error.message);
      toast.error('Erro ao excluir permanentemente título');
    }
  };

  // Obter título por ID
  const getTitleById = (id: string) => {
    return titles.find((title) => title.id === id);
  };

  return (
    <TitlesContext.Provider
      value={{
        titles,
        loading,
        addTitle,
        updateTitle,
        deleteTitle,
        restoreTitle,
        permanentlyDeleteTitle,
        getTitleById,
      }}
    >
      {children}
    </TitlesContext.Provider>
  );
};

export const useTitles = () => {
  const context = useContext(TitlesContext);
  if (!context) {
    throw new Error("useTitles must be used within a TitlesProvider");
  }
  return context;
};
