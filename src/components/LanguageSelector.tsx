
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Languages } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const isMobile = useIsMobile();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('preferredLanguage', langCode);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger 
        className={cn(
          "flex items-center gap-2 border-muted/60 bg-background/80 backdrop-blur-sm",
          isMobile ? "w-20 h-8 text-xs" : "w-36 h-10"
        )}
      >
        <Languages className={cn(isMobile ? "w-3 h-3" : "w-4 h-4")} />
        <SelectValue 
          placeholder="Language" 
          className="text-sm font-medium"
        >
          {isMobile ? currentLanguage.code.toUpperCase() : currentLanguage.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {languages.map((lang) => (
          <SelectItem 
            key={lang.code} 
            value={lang.code}
            className="flex items-center gap-2 h-11"
          >
            <div className="flex flex-col">
              <span className="font-medium">{lang.name}</span>
              {lang.name !== lang.nativeName && (
                <span className="text-xs text-muted-foreground">{lang.nativeName}</span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
