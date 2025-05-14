
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useTitles } from "@/contexts/TitlesContext";
import { TitleType, CategoryType } from "@/components/TitleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useCategories } from "@/hooks/use-categories";

const TitleFormContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { titles, addTitle, updateTitle, getTitleById } = useTitles();
  const { categories, loading: loadingCategories } = useCategories();
  
  const [name, setName] = useState("");
  const [type, setType] = useState<TitleType>("filme");
  const [category, setCategory] = useState<CategoryType>("comédia");
  const [rating, setRating] = useState<number>(5);
  const [image, setImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [titleLoaded, setTitleLoaded] = useState<boolean>(false);
  
  const isEditMode = !!id;
  
  useEffect(() => {
    if (isEditMode && !titleLoaded) {
      const title = getTitleById(id);
      if (title) {
        setName(title.name);
        setType(title.type);
        setCategory(title.category);
        setRating(title.rating);
        setImage(title.image);
        setTitleLoaded(true);
      } else {
        toast.error("Título não encontrado");
        navigate("/home");
      }
    }
  }, [id, getTitleById, isEditMode, titleLoaded, navigate]);
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateForm = (): boolean => {
    if (!name.trim()) {
      toast.error("O nome é obrigatório");
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const titleData = {
        name,
        type,
        category,
        rating,
        image
      };
      
      if (isEditMode) {
        await updateTitle(id, titleData, imageFile || undefined);
        toast.success("Título atualizado com sucesso");
      } else {
        await addTitle(titleData, imageFile || undefined);
        toast.success("Título adicionado com sucesso");
      }
      
      navigate("/home");
    } catch (error) {
      console.error("Erro ao salvar título:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Tipos disponíveis
  const types: TitleType[] = ["filme", "série", "novela"];
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? "Editar Título" : "Adicionar Título"}</CardTitle>
        <CardDescription>
          {isEditMode 
            ? "Atualize as informações do título existente" 
            : "Preencha os dados para adicionar um novo título"}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium mb-1 block">
              Nome
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do título"
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="type" className="text-sm font-medium mb-1 block">
              Tipo
            </label>
            <Select value={type} onValueChange={(value) => setType(value as TitleType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="category" className="text-sm font-medium mb-1 block">
              Categoria
            </label>
            <Select 
              value={category} 
              onValueChange={(value) => setCategory(value as CategoryType)}
              disabled={loadingCategories}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={loadingCategories ? "Carregando..." : "Selecione a categoria"} />
              </SelectTrigger>
              <SelectContent>
                {loadingCategories ? (
                  <SelectItem value="loading" disabled>Carregando categorias...</SelectItem>
                ) : (
                  categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name as CategoryType}>
                      {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="rating" className="text-sm font-medium mb-1 block">
              Nota: {rating.toFixed(1)}
            </label>
            <Slider
              value={[rating]}
              min={0}
              max={10}
              step={0.1}
              onValueChange={(values) => setRating(values[0])}
              className="py-4"
            />
          </div>
          
          <div>
            <label htmlFor="image" className="text-sm font-medium mb-1 block">
              Imagem
            </label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            
            {image && (
              <div className="mt-2">
                <img
                  src={image}
                  alt="Preview"
                  className="w-full max-h-48 object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate("/home")}
            type="button"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading 
              ? (isEditMode ? "Salvando..." : "Adicionando...") 
              : (isEditMode ? "Salvar" : "Adicionar")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TitleFormContent;
