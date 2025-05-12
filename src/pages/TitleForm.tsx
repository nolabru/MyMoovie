
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
import { Star } from "lucide-react";
import { Label } from "@/components/ui/label";

const TitleForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addTitle, updateTitle, getTitleById } = useTitles();

  const [formData, setFormData] = useState({
    name: "",
    type: "filme" as TitleType,
    category: "comédia" as CategoryType,
    rating: 5,
    image: "",
  });

  const isEditing = !!id;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica se existe um título
    if (!formData.name.trim()) {
      toast.error("O título é obrigatório");
      return;
    }

    if (isEditing) {
      updateTitle(id, formData);
      toast.success("Título atualizado com sucesso");
    } else {
      addTitle(formData);
      toast.success("Título adicionado com sucesso");
    }

    navigate("/");
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                name="type"
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
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
              <Label htmlFor="image">URL da imagem</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://exemplo.com/imagem.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Deixe em branco para usar uma imagem padrão
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TitleForm;
