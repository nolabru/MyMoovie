
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, FilmIcon, BookIcon, UsersIcon } from "lucide-react";

interface StatsData {
  totalTitles: number;
  totalCategories: number;
  totalTypes: number;
  titlesPerCategory: { name: string; count: number }[];
  titlesPerType: { name: string; count: number }[];
  totalUsers: number;
}

const StatsPanel = () => {
  // Buscar dados para estatísticas
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const statsData: StatsData = {
        totalTitles: 0,
        totalCategories: 0,
        totalTypes: 0,
        titlesPerCategory: [],
        titlesPerType: [],
        totalUsers: 0
      };

      // Total de títulos
      const { count: titlesCount, error: titlesError } = await supabase
        .from("titles")
        .select("*", { count: "exact", head: true })
        .eq("deleted", false);

      if (titlesError) throw titlesError;
      statsData.totalTitles = titlesCount || 0;

      // Total de categorias
      const { count: categoriesCount, error: categoriesError } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true });

      if (categoriesError) throw categoriesError;
      statsData.totalCategories = categoriesCount || 0;

      // Total de tipos
      const { count: typesCount, error: typesError } = await supabase
        .from("types")
        .select("*", { count: "exact", head: true });

      if (typesError) throw typesError;
      statsData.totalTypes = typesCount || 0;

      // Títulos por categoria
      const { data: categoriesData, error: catDataError } = await supabase
        .from("categories")
        .select("name");

      if (catDataError) throw catDataError;
      
      for (const cat of categoriesData) {
        const { count, error } = await supabase
          .from("titles")
          .select("*", { count: "exact", head: true })
          .eq("category", cat.name)
          .eq("deleted", false);
          
        if (error) throw error;
        
        statsData.titlesPerCategory.push({
          name: cat.name,
          count: count || 0
        });
      }
      
      // Títulos por tipo
      const { data: typesData, error: typeDataError } = await supabase
        .from("types")
        .select("name");

      if (typeDataError) throw typeDataError;
      
      for (const type of typesData) {
        const { count, error } = await supabase
          .from("titles")
          .select("*", { count: "exact", head: true })
          .eq("type", type.name)
          .eq("deleted", false);
          
        if (error) throw error;
        
        statsData.titlesPerType.push({
          name: type.name,
          count: count || 0
        });
      }

      // Total de usuários - isso requer uma edge function em produção
      const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
      if (usersError) throw usersError;
      statsData.totalUsers = usersData.users.length;

      return statsData;
    },
  });

  const renderStatCard = (title: string, value: number | string, icon: React.ReactNode) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Visão Geral</h2>
      
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="h-16 animate-pulse bg-muted rounded-md"></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="h-16 animate-pulse bg-muted rounded-md"></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="h-16 animate-pulse bg-muted rounded-md"></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="h-16 animate-pulse bg-muted rounded-md"></div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            {renderStatCard("Total de Títulos", stats?.totalTitles || 0, <FilmIcon className="h-4 w-4 text-muted-foreground" />)}
            {renderStatCard("Categorias", stats?.totalCategories || 0, <BookIcon className="h-4 w-4 text-muted-foreground" />)}
            {renderStatCard("Tipos", stats?.totalTypes || 0, <BarChart className="h-4 w-4 text-muted-foreground" />)}
            {renderStatCard("Usuários", stats?.totalUsers || 0, <UsersIcon className="h-4 w-4 text-muted-foreground" />)}
          </div>
          
          <Tabs defaultValue="categories" className="w-full">
            <TabsList>
              <TabsTrigger value="categories">Títulos por Categoria</TabsTrigger>
              <TabsTrigger value="types">Títulos por Tipo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories" className="space-y-4">
              <h3 className="text-lg font-medium">Distribuição por Categoria</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats?.titlesPerCategory.map((item) => (
                  <Card key={item.name}>
                    <CardContent className="pt-6">
                      <div className="text-lg font-medium">{item.name}</div>
                      <div className="text-3xl font-bold mt-2">{item.count}</div>
                      <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ 
                            width: `${Math.max(
                              (item.count / (stats?.totalTitles || 1)) * 100, 
                              5
                            )}%` 
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="types" className="space-y-4">
              <h3 className="text-lg font-medium">Distribuição por Tipo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats?.titlesPerType.map((item) => (
                  <Card key={item.name}>
                    <CardContent className="pt-6">
                      <div className="text-lg font-medium">{item.name}</div>
                      <div className="text-3xl font-bold mt-2">{item.count}</div>
                      <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ 
                            width: `${Math.max(
                              (item.count / (stats?.totalTitles || 1)) * 100, 
                              5
                            )}%` 
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default StatsPanel;
