
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error: any) {
    toast.error(`Erro ao carregar categorias: ${error.message}`);
    return [];
  }
};

export const createCategory = async (name: string): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success("Categoria criada com sucesso!");
    return data;
  } catch (error: any) {
    toast.error(`Erro ao criar categoria: ${error.message}`);
    return null;
  }
};

export const updateCategory = async (id: string, name: string): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success("Categoria atualizada com sucesso!");
    return data;
  } catch (error: any) {
    toast.error(`Erro ao atualizar categoria: ${error.message}`);
    return null;
  }
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    toast.success("Categoria excluída com sucesso!");
    return true;
  } catch (error: any) {
    toast.error(`Erro ao excluir categoria: ${error.message}`);
    return false;
  }
};
