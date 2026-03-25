import { useTranslations, useLocale } from 'next-intl';
import MaxWidthWrapper from '@/components/commons/MaxWidthWrapper';
import { FileCssIcon, FlagIcon, ShieldStarIcon } from '@phosphor-icons/react/dist/ssr';

const features = [
  {
    name: 'Next-Auth',
    description: {
      en: 'Complete and secure authentication with session handling, OAuth providers, and user access control.',
      fr: "Authentification complète et sécurisée avec gestion des sessions, fournisseurs OAuth et contrôle d'accès utilisateur.",
    },
    href: 'https://next-auth.js.org/',
    icon: ShieldStarIcon,
  },
  {
    name: 'Next-Intl',
    description: {
      en: 'Modern internationalization for handling multiple languages, locale formats, and translated content.',
      fr: 'Internationalisation moderne pour gérer plusieurs langues, formats de locale et contenu traduit.',
    },
    href: 'https://next-intl.dev/',
    icon: FlagIcon,
  },
  {
    name: 'TailwindCSS',
    description: {
      en: 'Utility-first CSS framework to build modern, consistent, and responsive interfaces quickly.',
      fr: 'Framework CSS utility-first pour créer rapidement des interfaces modernes, cohérentes et responsives.',
    },
    href: 'https://tailwindcss.com/',
    icon: FileCssIcon,
  },
];

export default function HomePage() {
  const locale = useLocale();
  const t = useTranslations('HomePage');

  return (
    <MaxWidthWrapper className="mt-16 flex flex-col items-center gap-6 py-12">
      <h2>{t('title')}</h2>
      <p className="text-foreground/60 mt-6 text-lg/8">{t('description')}</p>

      <div className="mx-auto mt-8 max-w-2xl sm:mt-16 lg:max-w-none">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col">
              <dt className="text-foreground/60 text-base/7 font-semibold">
                <div className="bg-foreground mb-3 flex size-10 items-center justify-center rounded-lg">
                  <feature.icon aria-hidden="true" className="text-background size-6" />
                </div>
                {feature.name}
              </dt>
              <dd className="text-foreground mt-1 flex flex-auto flex-col text-base/7">
                <p className="flex-auto">{feature.description[locale as 'en' | 'fr']}</p>
                <p className="mt-3">
                  <a
                    target="_blank"
                    href={feature.href}
                    rel="noopener noreferrer"
                    className="text-accent text-sm/6 font-semibold"
                  >
                    {t('learnMore')} <span aria-hidden="true">→</span>
                  </a>
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </MaxWidthWrapper>
  );
}
