import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr';
import MaxWidthWrapper from '@/components/commons/MaxWidthWrapper';

export default async function NotFoundPage() {
  const t = await getTranslations('NotFoundPage');

  return (
    <div className="min-h-page relative isolate">
      <Image
        alt=""
        src="https://images.unsplash.com/photo-1510133768164-a8f7e4d4e3dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75"
        fill
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover"
        priority
      />
      <MaxWidthWrapper className="py-24 text-center">
        <p className="text-base/8 font-semibold text-black">{t('eyebrow')}</p>
        <h1 className="mt-4 text-black">{t('title')}</h1>
        <p className="mt-6 text-lg font-medium text-pretty text-black/70 sm:text-xl/8">
          {t('description')}
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="bg-accent/80 hover:bg-accent flex h-10 items-center justify-center gap-1 rounded-md px-5 text-sm/7 font-semibold duration-150"
          >
            <CaretLeftIcon size={20} weight="bold" /> {t('primaryAction')}
          </Link>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
