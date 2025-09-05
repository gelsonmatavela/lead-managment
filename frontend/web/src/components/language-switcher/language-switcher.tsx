'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/src/components/shadcn-ui/ui/select';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [language, setLanguage] = useState<'en' | 'pt' | 'ch'>(() =>
    pathname.startsWith('/en') ? 'en' : 'pt'
  );

  useEffect(() => {
    const currentLang = pathname.startsWith('/en') ? 'en' : 'pt';
    if (currentLang !== language) {
      setLanguage(currentLang);
    }
  }, [pathname, language]);

  const switchLanguage = (value: 'en' | 'pt' | 'ch') => {
    if (value !== language) {
      setLanguage(value);
      const pathWithoutLang = pathname.replace(/^\/(en|pt)/, '') || '/';
      router.push(`/${value}${pathWithoutLang}`);
      router.refresh();
    }
  };

  return (
    <Select onValueChange={switchLanguage} value={language}>
      <SelectTrigger className='w-full border-none shadow-none rounded-md px-4 py-2 items-center gap-1 sm:flex hidden'>
        <Globe className='w-8 h-4' />
        <SelectValue placeholder={language.toUpperCase()} />{' '}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='pt'>Portuguese</SelectItem>
        <SelectItem value='en'>English</SelectItem>
        <SelectItem value='ch'>Mandarim</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
