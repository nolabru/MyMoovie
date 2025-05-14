
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, Shield, ShieldX, UserPlus } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserRole {
  id: string;
  user_id: string;
  role: string;
}

interface User {
  id: string;
  email: string;
  is_admin?: boolean;
}

const UsersManager = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Buscar todos os usuários
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // Buscar usuários do Auth - isso só pode ser feito com uma edge function em produção
      // Por simplicidade, vamos apenas listar os perfis de usuários ativos
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        throw authError;
      }
      
      // Buscar roles de administrador
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("role", "admin");
        
      if (rolesError) {
        throw rolesError;
      }
      
      // Combinar os dados
      const adminUserIds = new Set((roles as UserRole[]).map(r => r.user_id));
      
      const mappedUsers = authUsers.users.map(user => ({
        id: user.id,
        email: user.email || 'Sem email',
        is_admin: adminUserIds.has(user.id) || (user.email && user.email.endsWith('@admin.com')) || false
      }));
      
      return mappedUsers;
    },
  });

  // Adicionar usuário
  const addUserMutation = useMutation({
    mutationFn: async ({ email, password, isAdmin }: { email: string; password: string; isAdmin: boolean }) => {
      // Em produção, isso deve ser feito via Edge Function
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (error) throw error;
      
      // Se for admin e não tiver um email @admin.com, adicionar à tabela de roles
      if (isAdmin && !email.endsWith('@admin.com') && data.user) {
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ user_id: data.user.id, role: "admin" });
          
        if (roleError) throw roleError;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuário adicionado com sucesso!");
      setEmail("");
      setPassword("");
      setIsAddUserDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Erro ao adicionar usuário: ${error.message}`);
    },
  });

  // Alternar status de admin
  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      if (isAdmin) {
        // Remover privilégio de admin
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", "admin");
          
        if (error) throw error;
        
        return { userId, isAdmin: false };
      } else {
        // Adicionar privilégio de admin
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: "admin" });
          
        if (error) throw error;
        
        return { userId, isAdmin: true };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(
        data.isAdmin 
          ? "Privilégios de administrador adicionados com sucesso!" 
          : "Privilégios de administrador removidos com sucesso!"
      );
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar privilégios: ${error.message}`);
    },
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Digite um email para o usuário");
      return;
    }
    
    if (!password.trim() || password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    const isAdmin = email.endsWith('@admin.com');
    addUserMutation.mutate({ email, password, isAdmin });
  };

  const handleToggleAdmin = (userId: string, isAdmin: boolean, email: string) => {
    // Não permitir a remoção de admin para usuários com email @admin.com
    if (isAdmin && email.endsWith('@admin.com')) {
      toast.error("Não é possível remover privilégios de um administrador nato (@admin.com)");
      return;
    }
    
    toggleAdminMutation.mutate({ userId, isAdmin });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gerenciar Usuários</CardTitle>
          <CardDescription>
            Visualize e gerencie os usuários do sistema
          </CardDescription>
        </div>
        <Button onClick={() => setIsAddUserDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" /> Novo Usuário
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
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
            ) : users && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.is_admin ? (
                      <span className="flex items-center text-primary">
                        <Shield className="h-4 w-4 mr-1" /> Admin
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Usuário</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.email.endsWith('@admin.com') ? (
                      <Button variant="outline" size="sm" disabled>
                        <Check className="h-4 w-4 mr-1" /> Admin Nato
                      </Button>
                    ) : user.is_admin ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleAdmin(user.id, true, user.email)}
                      >
                        <ShieldX className="h-4 w-4 mr-1" /> Remover Admin
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleAdmin(user.id, false, user.email)}
                      >
                        <Shield className="h-4 w-4 mr-1" /> Tornar Admin
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Dialog para adicionar usuário */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Crie uma nova conta de usuário no sistema
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Use um email terminado em @admin.com para criar um administrador nato
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="password">Senha</label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={addUserMutation.isPending}>
                Adicionar Usuário
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UsersManager;
