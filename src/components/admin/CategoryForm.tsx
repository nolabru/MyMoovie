
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const categorySchema = z.object({
  name: z.string().min(2, {
    message: "Nome da categoria deve ter pelo menos 2 caracteres",
  }),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const CategoryForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.from("categories").insert({
        name: values.name.trim(),
      });

      if (error) {
        throw error;
      }

      toast.success("Categoria cadastrada com sucesso");
      form.reset();
    } catch (error: any) {
      console.error("Erro ao cadastrar categoria:", error.message);
      toast.error("Erro ao cadastrar categoria");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar Nova Categoria</CardTitle>
        <CardDescription>
          Adicione uma nova categoria ao sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome da categoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar Categoria"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
