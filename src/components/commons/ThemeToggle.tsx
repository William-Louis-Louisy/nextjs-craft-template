'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useTranslations } from 'next-intl';
import { MoonIcon, SunIcon } from '@phosphor-icons/react';

export default function ThemeToggle() {
  const t = useTranslations('ThemeToggle');
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      className="bg-element relative inline-flex size-10 cursor-pointer items-center justify-center rounded-full p-2"
      onClick={toggleTheme}
      aria-label={t('label')}
      title={t('label')}
    >
      {mounted && resolvedTheme === 'dark' ? (
        <SunIcon size={20} weight="bold" aria-hidden="true" />
      ) : (
        <MoonIcon size={20} weight="bold" aria-hidden="true" />
      )}
    </button>
  );
}
