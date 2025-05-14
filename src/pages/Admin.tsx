
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
import { Skeleton } from "@/components/ui/skeleton";

const Admin: React.FC = () => {
  const {
    user,
    loading,
    isAdmin,
    adminLoading
  } = useAuth();
  const navigate = useNavigate();
  const [verifyingAccess, setVerifyingAccess] = useState<boolean>(true);

  useEffect(() => {
    // Only verify access once when the component mounts or when auth state changes
    const verifyAccess = async () => {
      console.log("Admin.tsx: Verificando acesso, user:", !!user, "loading:", loading);
      
      if (!user && !loading) {
        console.log("Admin.tsx: Usuário não autenticado, redirecionando para login");
        toast.error("Faça login para acessar esta página");
        navigate("/login");
        return;
      }
      
      if (!user) {
        return;
      }
      
      try {
        setVerifyingAccess(true);
        console.log("Admin.tsx: Verificando acesso administrativo para:", user.email);
        
        // We don't need to call checkAdminStatus again since we already have isAdmin from useAuth
        // This was causing the infinite loop
        console.log("Admin.tsx: Resultado da verificação de admin:", isAdmin);
        
        if (!isAdmin) {
          toast.error("Acesso restrito a administradores");
          navigate("/");
        }
      } catch (error) {
        console.error("Admin.tsx: Erro ao verificar permissões:", error);
        toast.error("Erro ao verificar permissões");
        navigate("/");
      } finally {
        setVerifyingAccess(false);
      }
    };
    
    if (!loading && !adminLoading) {
      verifyAccess();
    }
  }, [user, loading, adminLoading, isAdmin, navigate]);

  // Mostra um indicador de carregamento enquanto verifica autenticação e permissões
  if (loading || adminLoading || verifyingAccess) {
    return (
      <>
        <Navbar onSearch={() => {}} adminOnly={true} />
        <div className="container py-8">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-8 w-48" />
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </>
    );
  }

  // Evita renderização durante redirecionamento
  if (!isAdmin) {
    return null;
  }

  return (
    <>
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
    </>
  );
};

export default Admin;
