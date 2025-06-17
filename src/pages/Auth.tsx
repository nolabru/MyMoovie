import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import PasswordReset from "@/components/auth/PasswordReset";
const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    signIn,
    signUp,
    user
  } = useAuth();
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(searchParams.get('reset') === 'true');

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value
    });
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    try {
      setLoading(true);
      await signIn(loginData.email, loginData.password);
      navigate("/");
    } catch (error) {
      // Erro já tratado no AuthContext
    } finally {
      setLoading(false);
    }
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (!registerData.email || !registerData.password || !registerData.confirmPassword) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    try {
      setLoading(true);
      await signUp(registerData.email, registerData.password);
      // Não redirecionamos imediatamente pois o usuário precisa confirmar o email
    } catch (error) {
      // Erro já tratado no AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setIsResetMode(true);
  };

  const handleBackToLogin = () => {
    setIsResetMode(false);
  };
  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo />
          <h2 className="mt-4 text-2xl font-bold">Bem-vindo ao MyMoovie</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie seus filmes, séries e novelas favoritos
          </p>
        </div>
        
        {isResetMode ? (
          <PasswordReset onBack={handleBackToLogin} />
        ) : (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Entre na sua conta para acessar seus títulos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input 
                        id="login-email" 
                        name="email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        value={loginData.email} 
                        onChange={handleLoginChange} 
                        disabled={loading} 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Senha</Label>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-xs" 
                          type="button"
                          onClick={handleForgotPassword}
                        >
                          Esqueceu a senha?
                        </Button>
                      </div>
                      <Input 
                        id="login-password" 
                        name="password" 
                        type="password" 
                        value={loginData.password} 
                        onChange={handleLoginChange} 
                        disabled={loading} 
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Cadastro</CardTitle>
                  <CardDescription>
                    Crie uma nova conta para começar a usar o MyMoovie
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nome</Label>
                      <Input 
                        id="register-name" 
                        name="name" 
                        placeholder="Seu nome" 
                        value={registerData.name} 
                        onChange={handleRegisterChange} 
                        disabled={loading} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input 
                        id="register-email" 
                        name="email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        value={registerData.email} 
                        onChange={handleRegisterChange} 
                        disabled={loading} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <Input 
                        id="register-password" 
                        name="password" 
                        type="password" 
                        value={registerData.password} 
                        onChange={handleRegisterChange} 
                        disabled={loading} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">
                        Confirme a senha
                      </Label>
                      <Input 
                        id="register-confirm-password" 
                        name="confirmPassword" 
                        type="password" 
                        value={registerData.confirmPassword} 
                        onChange={handleRegisterChange} 
                        disabled={loading} 
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Cadastrando..." : "Cadastrar"}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                  Ao se cadastrar, você concorda com nossos termos de serviço e política de privacidade
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};
export default Auth;
