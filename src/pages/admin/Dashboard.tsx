
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import CategoriesManager from "@/components/admin/CategoriesManager";
import TypesManager from "@/components/admin/TypesManager";
import UsersManager from "@/components/admin/UsersManager";
import StatsPanel from "@/components/admin/StatsPanel";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard Administrativo</h1>
        <p className="text-muted-foreground mb-8">
          Bem-vindo, {user?.email}! Gerencie seu catálogo aqui.
        </p>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="types">Tipos</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
          </TabsList>
          <TabsContent value="stats">
            <StatsPanel />
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesManager />
          </TabsContent>
          <TabsContent value="types">
            <TypesManager />
          </TabsContent>
          <TabsContent value="users">
            <UsersManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
