
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

interface Type {
  id: string;
  name: string;
  created_at: string;
}

const TypesManager = () => {
  const [newType, setNewType] = useState("");
  const [editingType, setEditingType] = useState<Type | null>(null);
  const queryClient = useQueryClient();

  // Buscar tipos
  const { data: types, isLoading } = useQuery({
    queryKey: ["types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("types")
        .select("*")
        .order("name");

      if (error) {
        throw error;
      }
      return data as Type[];
    },
  });

  // Adicionar tipo
  const addTypeMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("types")
        .insert({ name })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["types"] });
      toast.success("Tipo adicionado com sucesso!");
      setNewType("");
    },
    onError: (error: any) => {
      toast.error(`Erro ao adicionar tipo: ${error.message}`);
    },
  });

  // Atualizar tipo
  const updateTypeMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data, error } = await supabase
        .from("types")
        .update({ name, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["types"] });
      toast.success("Tipo atualizado com sucesso!");
      setEditingType(null);
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar tipo: ${error.message}`);
    },
  });

  // Remover tipo
  const deleteTypeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("types").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["types"] });
      toast.success("Tipo removido com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao remover tipo: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newType.trim()) {
      toast.error("Digite um nome para o tipo");
      return;
    }

    addTypeMutation.mutate(newType);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingType || !editingType.name.trim()) {
      toast.error("Digite um nome para o tipo");
      return;
    }

    updateTypeMutation.mutate({
      id: editingType.id,
      name: editingType.name,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este tipo?")) {
      deleteTypeMutation.mutate(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Tipos</CardTitle>
        <CardDescription>
          Adicione, edite ou remova tipos de itens do catálogo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex space-x-2 mb-6">
          <Input
            type="text"
            placeholder="Novo tipo..."
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={addTypeMutation.isPending}>
            <PlusCircle className="h-4 w-4 mr-2" /> Adicionar
          </Button>
        </form>

        {editingType && (
          <form onSubmit={handleUpdate} className="flex space-x-2 mb-6 p-4 bg-muted rounded-md">
            <Input
              type="text"
              value={editingType.name}
              onChange={(e) =>
                setEditingType({ ...editingType, name: e.target.value })
              }
              className="flex-1"
            />
            <Button type="submit" disabled={updateTypeMutation.isPending} variant="outline">
              <Pencil className="h-4 w-4 mr-2" /> Atualizar
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditingType(null)}
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
            ) : types && types.length > 0 ? (
              types.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>
                    {new Date(type.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingType(type)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(type.id)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Nenhum tipo encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TypesManager;
