import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInForm, SignUpForm, PasswordResetForm } from './components';
import { useAuth } from './hooks';

/**
 * Main authentication page component
 * Handles rendering the appropriate auth form based on user selection
 */
export function AuthPage() {
  const navigate = useNavigate();
  const [formType, setFormType] = useState('signin');
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/play');
    }
  }, [isAuthenticated, navigate]);

  const handleAuthSuccess = () => {
    navigate('/play');
  };

  const changeFormType = (newType) => {
    if (formType === newType) return;
    
    setFormType(newType);
  };

  const renderForm = () => {
    switch (formType) {
      case 'signin':
        return (
          <SignInForm 
            onSuccess={handleAuthSuccess} 
            onToggleForm={() => changeFormType('signup')}
            onForgotPassword={() => changeFormType('reset')}
          />
        );
      case 'signup':
        return (
          <SignUpForm 
            onSuccess={() => changeFormType('signin')} 
            onToggleForm={() => changeFormType('signin')}
          />
        );
      case 'reset':
        return (
          <PasswordResetForm 
            onSuccess={() => changeFormType('signin')} 
            onCancel={() => changeFormType('signin')}
          />
        );
      default:
        return <SignInForm 
          onSuccess={handleAuthSuccess} 
          onToggleForm={() => changeFormType('signup')}
          onForgotPassword={() => changeFormType('reset')}
        />;
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Pixel Jumper</h1>
          <p className="text-gray-600">Sign in to start your adventure</p>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-8 auth-form-container transition-all duration-150">
          {renderForm()}
        </div>
      </div>
    </div>
  );
}
