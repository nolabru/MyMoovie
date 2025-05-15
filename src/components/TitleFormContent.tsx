
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useTitles } from "@/contexts/TitlesContext";
import { TitleType, CategoryType } from "@/components/TitleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/use-categories";
import { Upload, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [imageUrl, setImageUrl] = useState<string>("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
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
      let finalImage = image;
      
      // Se tiver URL externa, usar ela
      if (imageUrl && !imageFile) {
        finalImage = imageUrl;
      }
      
      const titleData = {
        name,
        type,
        category,
        rating,
        image: finalImage
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
  
  // Renderizar estrelas para avaliação com design melhorado
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          type="button"
          key={i} 
          className="focus:outline-none"
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(null)}
          onClick={() => setRating(i)}
        >
          <Star 
            className={`w-6 h-6 transition-all ${
              i <= (hoverRating || rating) 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-400"
            } ${
              hoverRating && i <= hoverRating ? "scale-110" : ""
            }`}
            strokeWidth={1.5}
          />
        </button>
      );
    }
    return stars;
  };
  
  return (
    <div className="max-w-md mx-auto p-6 py-8 my-6 border border-border rounded-lg text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Editar Título" : "Novo Título"}
        </h1>
        <p className="text-gray-400 text-sm">
          {isEditMode 
            ? "Atualize os detalhes do título existente"
            : "Preencha os detalhes do novo título que deseja adicionar"}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-transparent">
        <div>
          <label htmlFor="name" className="block text-sm mb-1">
            Nome do título
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Stranger Things"
            className="w-full bg-transparent border-gray-600 text-white focus:border-red-500"
          />
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm mb-1">
            Tipo
          </label>
          <Select 
            value={type} 
            onValueChange={(value) => setType(value as TitleType)}
          >
            <SelectTrigger className="w-full bg-transparent border-gray-600 text-white focus:border-red-500">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent className="bg-background border-gray-600 text-white">
              <SelectItem value="filme">Filme</SelectItem>
              <SelectItem value="série">Série</SelectItem>
              <SelectItem value="novela">Novela</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm mb-1">
            Categoria
          </label>
          <Select 
            value={category} 
            onValueChange={(value) => setCategory(value as CategoryType)}
            disabled={loadingCategories}
          >
            <SelectTrigger className="w-full bg-transparent border-gray-600 text-white focus:border-red-500">
              <SelectValue placeholder={loadingCategories ? "Carregando categorias..." : "Selecione a categoria"} />
            </SelectTrigger>
            <SelectContent className="bg-background border-gray-600 text-white">
              {loadingCategories ? (
                <SelectItem value="carregando">Carregando categorias...</SelectItem>
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
          <label className="block text-sm mb-2">Avaliação</label>
          <div className="flex items-center space-x-3">
            {renderStars()}
            <span className="ml-3 text-sm">
              {rating} de 5 estrelas
            </span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm mb-1">Imagem</label>
          <div 
            className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors bg-transparent"
            onClick={() => document.getElementById("imageInput")?.click()}
          >
            {image ? (
              <img 
                src={image} 
                alt="Preview" 
                className="max-h-48 object-contain mx-auto"
              />
            ) : (
              <div className="py-8 flex flex-col items-center text-gray-400">
                <Upload className="h-8 w-8 mb-2" />
                <p>Clique para fazer upload</p>
                <p className="text-xs mt-1">PNG, JPG ou WEBP (máx. 5MB)</p>
              </div>
            )}
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="imageUrl" className="block text-sm mb-1">
            Ou informe a URL da imagem
          </label>
          <Input
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://exemplo.com/imagem.jpg"
            className="w-full bg-transparent border-gray-600 text-white focus:border-red-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Deixe em branco para usar uma imagem padrão
          </p>
        </div>
        
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/home")}
            className="w-1/2 bg-transparent border-gray-600 text-white hover:bg-gray-800"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-1/2 bg-red-600 hover:bg-red-700 text-white"
          >
            {loading
              ? (isEditMode ? "Salvando..." : "Adicionando...")
              : (isEditMode ? "Salvar" : "Adicionar")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TitleFormContent;
