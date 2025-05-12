
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTitles } from "@/contexts/TitlesContext";
import { TitleType, CategoryType } from "@/components/TitleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Star, Upload, Image } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const TitleForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addTitle, updateTitle, getTitleById } = useTitles();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    type: "filme" as TitleType,
    category: "comédia" as CategoryType,
    rating: 5,
    image: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEditing = !!id;

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!user) {
      toast.error("É preciso estar logado para adicionar ou editar títulos");
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isEditing) {
      const title = getTitleById(id);
      if (title) {
        setFormData({
          name: title.name,
          type: title.type,
          category: title.category,
          rating: title.rating,
          image: title.image,
        });
        
        if (title.image) {
          setImagePreview(title.image);
        }
      } else {
        navigate("/");
      }
    }
  }, [id, getTitleById, navigate, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRatingChange = (rating: number) => {
    setFormData({
      ...formData,
      rating,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica se existe um título
    if (!formData.name.trim()) {
      toast.error("O título é obrigatório");
      return;
    }

    try {
      setLoading(true);
      
      if (isEditing) {
        await updateTitle(id, formData, imageFile || undefined);
        toast.success("Título atualizado com sucesso");
      } else {
        await addTitle(formData, imageFile || undefined);
        toast.success("Título adicionado com sucesso");
      }

      navigate("/");
    } catch (error: any) {
      console.error("Erro ao salvar título:", error);
      toast.error("Ocorreu um erro ao salvar o título");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? "Editar Título" : "Adicionar Novo Título"}
      </h1>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Título" : "Novo Título"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Atualize as informações do título selecionado"
              : "Preencha os detalhes do novo título que deseja adicionar"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do título</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Stranger Things"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                name="type"
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="filme">Filme</SelectItem>
                  <SelectItem value="série">Série</SelectItem>
                  <SelectItem value="novela">Novela</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                name="category"
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comédia">Comédia</SelectItem>
                  <SelectItem value="terror">Terror</SelectItem>
                  <SelectItem value="romance">Romance</SelectItem>
                  <SelectItem value="ação">Ação</SelectItem>
                  <SelectItem value="drama">Drama</SelectItem>
                  <SelectItem value="ficção">Ficção</SelectItem>
                  <SelectItem value="animação">Animação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Avaliação</Label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    type="button"
                    variant="ghost"
                    className="p-1 h-auto"
                    onClick={() => handleRatingChange(star)}
                    disabled={loading}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= formData.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                ))}
                <span className="ml-2 text-sm">
                  {formData.rating} de 5 estrelas
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Imagem</Label>
              <div className="flex flex-col items-center space-y-4">
                {imagePreview && (
                  <div className="relative w-full h-40 rounded-md overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md border-gray-300 px-6 py-6 hover:border-primary transition-colors">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div className="flex justify-center text-sm text-muted-foreground">
                          <span>Clique para fazer upload</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG ou WEBP (max. 5MB)
                        </p>
                      </div>
                    </div>
                    <input
                      id="image-upload"
                      name="image"
                      type="file"
                      className="sr-only"
                      onChange={handleImageChange}
                      accept="image/*"
                      disabled={loading}
                    />
                  </Label>
                </div>
                
                <div className="w-full">
                  <Label htmlFor="image-url">Ou informe a URL da imagem</Label>
                  <Input
                    id="image-url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="mt-1"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Deixe em branco para usar uma imagem padrão
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : isEditing ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TitleForm;
