import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface ResetCodeProps {
  email: string;
  onBack: () => void;
  onCodeVerified: () => void;
}

const ResetCode: React.FC<ResetCodeProps> = ({ email, onBack, onCodeVerified }) => {
  const { verifyResetCode, resetPassword } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      return;
    }
    
    try {
      setLoading(true);
      await verifyResetCode(email, code);
      onCodeVerified();
    } catch (error) {
      // Erro já tratado no AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      await resetPassword(email);
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
            <CardTitle>Verificar código</CardTitle>
            <CardDescription>
              Digite o código de 6 dígitos enviado para {email}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-code">Código de verificação</Label>
            <div className="flex justify-center py-4">
              <InputOTP 
                maxLength={6} 
                value={code} 
                onChange={setCode}
                disabled={loading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
            {loading ? "Verificando..." : "Verificar código"}
          </Button>
          <div className="text-center mt-4">
            <Button 
              variant="link" 
              type="button" 
              onClick={handleResendCode} 
              disabled={loading}
            >
              Não recebeu o código? Reenviar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResetCode;
