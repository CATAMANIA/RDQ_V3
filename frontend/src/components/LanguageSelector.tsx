import React from 'react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Languages, ChevronDown } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

const languageFlags: Record<Language, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
  de: '🇩🇪',
  es: '🇪🇸'
};

const languageNames: Record<Language, string> = {
  fr: 'Français',
  en: 'English',
  de: 'Deutsch',
  es: 'Español'
};

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-auto px-2 hover:bg-rdq-gray-light/20 focus:bg-rdq-gray-light/20"
          aria-label={`${t('common.language')}: ${languageNames[language]}`}
        >
          <Languages className="h-4 w-4 mr-1" aria-hidden="true" />
          <span className="hidden sm:inline mr-1">
            {languageFlags[language]} {languageNames[language]}
          </span>
          <span className="sm:hidden mr-1">
            {languageFlags[language]}
          </span>
          <ChevronDown className="h-3 w-3" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {(Object.keys(languageNames) as Language[]).map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`cursor-pointer focus:bg-rdq-blue-light/10 ${
              language === lang ? 'bg-rdq-blue-light/20' : ''
            }`}
            role="menuitemradio"
            aria-checked={language === lang}
          >
            <span className="mr-2" aria-hidden="true">{languageFlags[lang]}</span>
            {languageNames[lang]}
            {language === lang && (
              <span className="ml-auto text-rdq-blue-dark" aria-hidden="true">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};