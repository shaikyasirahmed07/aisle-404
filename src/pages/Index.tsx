import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    // Short delay to show the language selection briefly
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (user) {
          // Redirect authenticated users to their dashboard
          navigate(user.role === 'admin' ? '/admin' : '/customer');
        } else {
          // Redirect unauthenticated users to login
          navigate('/login');
        }
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-6"></div>
          <p className="text-xl font-medium mb-8">{t('common.loading')}</p>
          
          <div className="mt-6">
            <p className="text-muted-foreground mb-3">{t('common.selectLanguage')}</p>
            <LanguageSelector />
          </div>
        </div>
      </div>
    );
  }

  // Landing page with language selector before redirect
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">{t('common.welcome')}</h1>
        <p className="text-muted-foreground mb-8">{t('common.selectYourLanguage')}</p>
        
        <div className="mb-8 w-full">
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
};

export default Index;
