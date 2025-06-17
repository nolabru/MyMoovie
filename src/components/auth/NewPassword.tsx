import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface NewPasswordProps {
  onBack: () => void;
}

const NewPassword: React.FC<NewPasswordProps> = ({ onBack }) => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.password || !formData.confirmPassword) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    try {
      setLoading(true);
      await updatePassword(formData.password);
      toast.success("Senha atualizada com sucesso!");
      navigate("/");
    } catch (error) {
      // Erro já tratado no AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="mr-2"
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <CardTitle>Nova senha</CardTitle>
            <CardDescription>
              Crie uma nova senha para sua conta
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">Nova senha</Label>
            <Input 
              id="new-password" 
              name="password"
              type="password" 
              value={formData.password} 
              onChange={handleChange} 
              disabled={loading} 
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirme a nova senha</Label>
            <Input 
              id="confirm-password" 
              name="confirmPassword"
              type="password" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              disabled={loading} 
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Atualizando..." : "Atualizar senha"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewPassword;
