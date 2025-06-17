import React, { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import ResetCode from "./ResetCode";
import NewPassword from "./NewPassword";

enum ResetStep {
  REQUEST = "request",
  VERIFY_CODE = "verify_code",
  NEW_PASSWORD = "new_password"
}

interface PasswordResetProps {
  onBack: () => void;
}

const PasswordReset: React.FC<PasswordResetProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState<ResetStep>(ResetStep.REQUEST);
  const [email, setEmail] = useState("");

  const handleCodeSent = (email: string) => {
    setEmail(email);
    setCurrentStep(ResetStep.VERIFY_CODE);
  };

  const handleCodeVerified = () => {
    setCurrentStep(ResetStep.NEW_PASSWORD);
  };

  const handleBackToRequest = () => {
    setCurrentStep(ResetStep.REQUEST);
  };

  const handleBackToVerify = () => {
    setCurrentStep(ResetStep.VERIFY_CODE);
  };

  return (
    <>
      {currentStep === ResetStep.REQUEST && (
        <ForgotPassword 
          onBack={onBack} 
          onCodeSent={handleCodeSent} 
        />
      )}
      
      {currentStep === ResetStep.VERIFY_CODE && (
        <ResetCode 
          email={email} 
          onBack={handleBackToRequest} 
          onCodeVerified={handleCodeVerified} 
        />
      )}
      
      {currentStep === ResetStep.NEW_PASSWORD && (
        <NewPassword 
          onBack={handleBackToVerify} 
        />
      )}
    </>
  );
};

export default PasswordReset;
