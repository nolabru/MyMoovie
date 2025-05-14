
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
  syncTitlesWithCategories: () => Promise<void>;
}

const TitlesContext = createContext<TitlesContextType | undefined>(undefined);

export const TitlesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Carregar títulos do usuário atual
  useEffect(() => {
    const fetchTitles = async () => {
      if (!user) {
        setTitles([]);
        setLoading(false);
        return;
      }

      try {
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
      } catch (error: any) {
        console.error('Erro ao carregar títulos:', error.message);
        toast.error('Erro ao carregar títulos');
      } finally {
        setLoading(false);
      }
    };

    fetchTitles();
  }, [user]);

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

  // Sincronizar títulos com categorias (para atualização automática quando categorias forem editadas)
  const syncTitlesWithCategories = async () => {
    if (!user) return;

    try {
      // Fetch valid categories from database
      const { data: validCategories, error: categoriesError } = await supabase
        .from('categories')
        .select('name');

      if (categoriesError) throw categoriesError;
      
      // Create a set of valid category names
      const validCategoryNames = new Set(validCategories.map(c => c.name));
      
      // Find titles with categories that no longer exist
      const titlesToUpdate = titles.filter(
        title => !validCategoryNames.has(title.category) && !title.deleted
      );
      
      if (titlesToUpdate.length === 0) return;
      
      // If there are invalid categories, update them to the first available category or 'assistir' as fallback
      const defaultCategory = validCategoryNames.size > 0 
        ? validCategories[0].name 
        : 'assistir';
        
      // Update each title with invalid category
      for (const title of titlesToUpdate) {
        await supabase
          .from('titles')
          .update({ category: defaultCategory })
          .eq('id', title.id)
          .eq('user_id', user.id);
      }
      
      // Update local state
      setTitles(prevTitles => 
        prevTitles.map(title => 
          titlesToUpdate.some(t => t.id === title.id) 
            ? { ...title, category: defaultCategory as CategoryType } 
            : title
        )
      );
      
      // Notify user if titles were updated
      if (titlesToUpdate.length > 0) {
        toast.info(`${titlesToUpdate.length} título(s) atualizados devido a mudanças nas categorias disponíveis.`);
      }
      
    } catch (error: any) {
      console.error('Erro ao sincronizar títulos com categorias:', error.message);
    }
  };
  
  // Listen for category changes
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('categories-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'categories' 
      }, () => {
        syncTitlesWithCategories();
      })
      .subscribe();
    
    // Initial sync
    syncTitlesWithCategories();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, titles.length]);

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
        syncTitlesWithCategories,
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
