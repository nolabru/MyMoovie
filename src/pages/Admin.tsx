
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import CategoryForm from "@/components/admin/CategoryForm";
import CategoriesList from "@/components/admin/CategoriesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const Admin: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminLoading, setAdminLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });
        
        if (error) {
          throw error;
        }
        
        setIsAdmin(data);
      } catch (error: any) {
        console.error("Erro ao verificar status de admin:", error.message);
        toast.error("Erro ao verificar permissões de administrador");
      } finally {
        setAdminLoading(false);
      }
    };

    if (user) {
      checkAdminStatus();
    } else if (!loading) {
      setAdminLoading(false);
    }
  }, [user, loading]);

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Redirecionar se não for administrador
  useEffect(() => {
    if (!adminLoading && !isAdmin && user) {
      toast.error("Acesso restrito a administradores");
      navigate("/home");
    }
  }, [isAdmin, adminLoading, user, navigate]);

  if (loading || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Carregando...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Evita renderização durante redirecionamento
  }

  return (
    <>
      <Navbar onSearch={() => {}} />
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bem-vindo ao Painel Administrativo</CardTitle>
            <CardDescription>
              Gerencie as categorias do sistema. Apenas usuários com emails @admin.com têm acesso a este painel.
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="listar" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="listar">Listar Categorias</TabsTrigger>
            <TabsTrigger value="cadastrar">Cadastrar Categoria</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listar">
            <CategoriesList />
          </TabsContent>
          
          <TabsContent value="cadastrar">
            <CategoryForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Admin;
