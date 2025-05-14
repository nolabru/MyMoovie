
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  Category 
} from "@/services/categoriesService";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nome da categoria é obrigatório" })
});

type FormValues = z.infer<typeof formSchema>;

const AdminCategories = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const queryClient = useQueryClient();
  
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ""
    }
  });
  
  // Reset form when selected category changes
  useEffect(() => {
    if (selectedCategory) {
      form.reset({ name: selectedCategory.name });
    } else {
      form.reset({ name: "" });
    }
  }, [selectedCategory, form]);
  
  const createMutation = useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsDialogOpen(false);
      form.reset();
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateCategory(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsDialogOpen(false);
      setSelectedCategory(null);
      form.reset();
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });
  
  const onSubmit = (values: FormValues) => {
    if (selectedCategory) {
      updateMutation.mutate({ id: selectedCategory.id, name: values.name });
    } else {
      createMutation.mutate(values.name);
    }
  };
  
  const handleOpenDialog = (category?: Category) => {
    setSelectedCategory(category || null);
    setIsDialogOpen(true);
  };
  
  const handleDeleteCategory = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      deleteMutation.mutate(id);
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gerenciamento de Categorias</CardTitle>
              <CardDescription>
                Adicione, edite ou remova categorias do sistema
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Nova Categoria
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead>Última Atualização</TableHead>
                  <TableHead className="w-[120px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      Nenhuma categoria encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>
                        {new Date(category.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(category.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(category)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory
                ? "Atualize os detalhes da categoria abaixo"
                : "Preencha as informações para criar uma nova categoria"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Digite o nome da categoria" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                  ) : null}
                  {selectedCategory ? "Atualizar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
