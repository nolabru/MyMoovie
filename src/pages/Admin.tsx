
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import CategoryForm from "@/components/admin/CategoryForm";
import CategoriesList from "@/components/admin/CategoriesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const Admin: React.FC = () => {
  const {
    user,
    loading,
    isAdmin,
    checkAdminStatus
  } = useAuth();
  const navigate = useNavigate();
  const [adminLoading, setAdminLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAccess = async () => {
      if (!user) {
        return;
      }
      try {
        setAdminLoading(true);
        const isUserAdmin = await checkAdminStatus();
        if (!isUserAdmin) {
          toast.error("Acesso restrito a administradores");
          navigate("/home");
        }
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        toast.error("Erro ao verificar permissões");
        navigate("/home");
      } finally {
        setAdminLoading(false);
      }
    };
    if (user) {
      verifyAccess();
    } else if (!loading) {
      setAdminLoading(false);
      navigate("/login");
    }
  }, [user, loading, navigate, checkAdminStatus]);

  if (loading || adminLoading) {
    return <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Carregando...</div>
      </div>;
  }

  if (!isAdmin) {
    return null; // Evita renderização durante redirecionamento
  }

  return <>
      <Navbar onSearch={() => {}} adminOnly={true} />
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        </div>

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
    </>;
};

export default Admin;
