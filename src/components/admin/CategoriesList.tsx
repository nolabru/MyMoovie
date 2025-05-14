
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash } from "lucide-react";

type Category = {
  id: string;
  name: string;
  created_at: string | null;
};

const CategoriesList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        throw error;
      }

      setCategories(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar categorias:", error.message);
      toast.error("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (category: Category) => {
    setEditingCategory(category);
    setOpenDeleteDialog(true);
  };

  const updateCategory = async () => {
    if (!editingCategory || !categoryName.trim()) return;

    try {
      const { error } = await supabase
        .from("categories")
        .update({ name: categoryName.trim(), updated_at: new Date().toISOString() })
        .eq("id", editingCategory.id);

      if (error) {
        throw error;
      }

      toast.success("Categoria atualizada com sucesso");
      setOpenEditDialog(false);
      fetchCategories();
    } catch (error: any) {
      console.error("Erro ao atualizar categoria:", error.message);
      toast.error("Erro ao atualizar categoria");
    }
  };

  const deleteCategory = async () => {
    if (!editingCategory) return;

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", editingCategory.id);

      if (error) {
        throw error;
      }

      toast.success("Categoria excluída com sucesso");
      setOpenDeleteDialog(false);
      fetchCategories();
    } catch (error: any) {
      console.error("Erro ao excluir categoria:", error.message);
      toast.error("Erro ao excluir categoria");
    }
  };

  if (loading) {
    return <div className="text-center py-4">Carregando categorias...</div>;
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Nenhuma categoria encontrada
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    {category.created_at 
                      ? new Date(category.created_at).toLocaleDateString('pt-BR') 
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditClick(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteClick(category)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de Edição */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="categoryName">Nome da Categoria</Label>
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={updateCategory}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Exclusão */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Tem certeza que deseja excluir a categoria "{editingCategory?.name}"?
            Esta ação não pode ser desfeita.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deleteCategory}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesList;
