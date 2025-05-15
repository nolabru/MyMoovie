
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash, Info } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
  const [titleCount, setTitleCount] = useState<number>(0);
  const [showInfoDialog, setShowInfoDialog] = useState<boolean>(false);

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

  const handleDeleteClick = async (category: Category) => {
    setEditingCategory(category);
    
    // Check if any titles are using this category
    try {
      const { count, error } = await supabase
        .from("titles")
        .select("*", { count: 'exact', head: true })
        .eq("category", category.name);
        
      if (error) throw error;
      
      setTitleCount(count || 0);
      setOpenDeleteDialog(true);
    } catch (error: any) {
      console.error("Erro ao verificar uso da categoria:", error.message);
      toast.error("Erro ao verificar uso da categoria");
    }
  };

  const updateCategory = async () => {
    if (!editingCategory || !categoryName.trim()) return;
    
    try {
      // Check for duplicate
      const { data: existingCategory, error: checkError } = await supabase
        .from("categories")
        .select("name")
        .eq("name", categoryName.trim())
        .neq("id", editingCategory.id)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingCategory) {
        toast.error("Já existe uma categoria com este nome");
        return;
      }
      
      // Store the old category name before updating
      const oldCategoryName = editingCategory.name;
      
      // Update category
      const { error } = await supabase
        .from("categories")
        .update({ name: categoryName.trim(), updated_at: new Date().toISOString() })
        .eq("id", editingCategory.id);

      if (error) {
        throw error;
      }
      
      // Update all titles with this category
      const { error: updateTitlesError } = await supabase
        .from("titles")
        .update({ category: categoryName.trim() })
        .eq("category", oldCategoryName);
        
      if (updateTitlesError) {
        console.error("Erro ao atualizar títulos:", updateTitlesError.message);
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
      // Delete the category
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", editingCategory.id);

      if (error) {
        throw error;
      }
      
      // If there are titles using this category, update them
      if (titleCount > 0) {
        // Get first available category or use 'assistir' as fallback
        let defaultCategory = 'assistir';
        if (categories.length > 1) {
          const alternativeCategory = categories.find(c => c.id !== editingCategory.id);
          if (alternativeCategory) {
            defaultCategory = alternativeCategory.name;
          }
        }
        
        // Update all titles with the deleted category
        const { error: updateTitlesError } = await supabase
          .from("titles")
          .update({ category: defaultCategory })
          .eq("category", editingCategory.name);
          
        if (updateTitlesError) {
          console.error("Erro ao atualizar títulos:", updateTitlesError.message);
          toast.error("Erro ao atualizar títulos afetados");
        } else {
          setShowInfoDialog(true);
        }
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
            <p>
              Tem certeza que deseja excluir a categoria "{editingCategory?.name}"?
            </p>
            {titleCount > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-md">
                <div className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  <p className="font-medium">Atenção!</p>
                </div>
                <p className="mt-1">
                  Esta categoria está sendo usada em {titleCount} título(s). 
                  Se você excluí-la, esses títulos serão reclassificados para outra categoria disponível.
                </p>
              </div>
            )}
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
      
      {/* Diálogo de Informação pós-exclusão */}
      <AlertDialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Categoria excluída</AlertDialogTitle>
            <AlertDialogDescription>
              {titleCount} título(s) foram atualizados para usar uma categoria diferente.
              Os usuários serão notificados sobre essa alteração quando acessarem seus títulos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Entendi</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoriesList;
