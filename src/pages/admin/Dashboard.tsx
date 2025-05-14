
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import CategoriesManager from "@/components/admin/CategoriesManager";
import TypesManager from "@/components/admin/TypesManager";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {user?.email}! Gerencie o catálogo aqui.
          </p>
        </div>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="types">Tipos</TabsTrigger>
          </TabsList>
          <TabsContent value="categories">
            <CategoriesManager />
          </TabsContent>
          <TabsContent value="types">
            <TypesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
