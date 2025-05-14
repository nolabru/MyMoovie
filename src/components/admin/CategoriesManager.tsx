
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PlusCircle, X, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Category {
  id: string;
  name: string;
  created_at: string;
}

const CategoriesManager = () => {
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();

  // Buscar categorias
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) {
        throw error;
      }
      return data as Category[];
    },
  });

  // Adicionar categoria
  const addCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("categories")
        .insert({ name })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria adicionada com sucesso!");
      setNewCategory("");
    },
    onError: (error: any) => {
      toast.error(`Erro ao adicionar categoria: ${error.message}`);
    },
  });

  // Atualizar categoria
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data, error } = await supabase
        .from("categories")
        .update({ name, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria atualizada com sucesso!");
      setEditingCategory(null);
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar categoria: ${error.message}`);
    },
  });

  // Remover categoria
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria removida com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao remover categoria: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.trim()) {
      toast.error("Digite um nome para a categoria");
      return;
    }

    addCategoryMutation.mutate(newCategory);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCategory || !editingCategory.name.trim()) {
      toast.error("Digite um nome para a categoria");
      return;
    }

    updateCategoryMutation.mutate({
      id: editingCategory.id,
      name: editingCategory.name,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Categorias</CardTitle>
        <CardDescription>
          Adicione, edite ou remova categorias do catálogo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex space-x-2 mb-6">
          <Input
            type="text"
            placeholder="Nova categoria..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={addCategoryMutation.isPending}>
            <PlusCircle className="h-4 w-4 mr-2" /> Adicionar
          </Button>
        </form>

        {editingCategory && (
          <form onSubmit={handleUpdate} className="flex space-x-2 mb-6 p-4 bg-muted rounded-md">
            <Input
              type="text"
              value={editingCategory.name}
              onChange={(e) =>
                setEditingCategory({ ...editingCategory, name: e.target.value })
              }
              className="flex-1"
            />
            <Button type="submit" disabled={updateCategoryMutation.isPending} variant="outline">
              <Pencil className="h-4 w-4 mr-2" /> Atualizar
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditingCategory(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </form>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : categories && categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    {new Date(category.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingCategory(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Nenhuma categoria encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CategoriesManager;
