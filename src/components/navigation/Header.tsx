import {
  Menu,
  MenuItem,
  MenuItems,
  Disclosure,
  MenuButton,
  DisclosurePanel,
  DisclosureButton,
} from '@headlessui/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Logo from '../commons/Logo';
import { useTranslations } from 'next-intl';
import ThemeToggle from '../commons/ThemeToggle';
import LocaleSwitch from '../commons/LocaleSwitch';
import { Link, usePathname } from '@/i18n/navigation';
import MaxWidthWrapper from '../commons/MaxWidthWrapper';
import { useSession, signIn, signOut } from 'next-auth/react';
import { ListIcon, SignInIcon, SignOutIcon, UserIcon, XIcon } from '@phosphor-icons/react';

export const navLinks = [
  { tradKey: 'about', url: '#' },
  { tradKey: 'faq', url: '#' },
  { tradKey: 'contact', url: '#' },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const t = useTranslations('Header');
  const isLinkActive = (pathname: string, url: string) => {
    if (url === '/') return pathname === '/';
    return pathname === url || pathname.startsWith(`${url}/`);
  };

  return (
    <Disclosure as="nav" className={'bg-background fixed inset-x-0 top-0 z-50'}>
      {/* Header */}
      <MaxWidthWrapper>
        <header className="h-header flex items-center justify-between">
          <div className="flex">
            <Logo />
          </div>
          {/* Navigation */}
          <div className="hidden items-center justify-center lg:ml-6 lg:grid lg:grid-cols-3">
            {navLinks.map((link) => {
              const active = isLinkActive(pathname, link.url);

              return (
                <Link
                  key={link.tradKey}
                  href={link.url}
                  className={cn(
                    'hover:text-foreground/80 flex h-16 items-center justify-center border-b-2 px-6 duration-200',
                    active
                      ? 'text-accent border-accent font-bold'
                      : 'text-foreground/60 hover:border-foreground/20 border-transparent font-medium',
                  )}
                >
                  {t(`navigation.${link.tradKey}`)}
                </Link>
              );
            })}
          </div>

          {/* Lang & Theme */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:gap-4">
            <ThemeToggle />
            <LocaleSwitch />

            {/* DropDown */}
            {session ? (
              <Menu as="div" className="relative">
                <div>
                  <MenuButton className="relative flex cursor-pointer rounded-full text-sm focus:outline-none">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">{t('openUserMenu')}</span>
                    <span className="bg-element flex size-10 items-center justify-center rounded-full p-2">
                      {session?.user.image ? (
                        <Image
                          alt="avatar"
                          src={session?.user.image}
                          width={36}
                          height={36}
                          className="rounded-full"
                        />
                      ) : (
                        <UserIcon weight="bold" size={20} />
                      )}
                    </span>
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="bg-element absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-0 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in"
                >
                  {session.user?.role === 'ADMIN' && (
                    <MenuItem>
                      <Link
                        href="/admin"
                        className="data-focus:bg-alternative data-focus:text-background block px-4 py-2 text-sm"
                      >
                        {t('navigation.adminDashboard')}
                      </Link>
                    </MenuItem>
                  )}

                  <MenuItem>
                    <button
                      className="data-focus:bg-alternative data-focus:text-background flex w-full cursor-pointer items-center gap-2 px-4 pt-2.5 pb-2 text-sm"
                      onClick={() => signOut()}
                    >
                      <SignOutIcon size={20} />
                      <span className="hidden md:flex">{t('logout')}</span>
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              <button
                className="text-background bg-accent/80 hover:bg-accent hover:text-foreground inline-flex h-10 cursor-pointer items-center gap-1 rounded-md px-4 py-2 duration-150"
                onClick={() => signIn('google')}
              >
                <SignInIcon className="flex" size={20} />
                <span className="hidden text-sm md:flex">{t('login')}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 focus:outline-none">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">{t('openMainMenu')}</span>
              <ListIcon aria-hidden="true" className="block h-6 w-6 group-data-open:hidden" />
              <XIcon aria-hidden="true" className="hidden h-6 w-6 group-data-open:block" />
            </DisclosureButton>
          </div>
        </header>
      </MaxWidthWrapper>

      {/* Mobile Menu */}
      <DisclosurePanel className="h-page sm:hidden">
        <div className="space-y-1 pt-2 pb-3">
          <div className="flex h-full flex-col items-center justify-center">
            <div className="absolute right-4 bottom-4 inline-flex items-center gap-4">
              <ThemeToggle /> <LocaleSwitch />
            </div>
            {/** Here goes the navigation links wrapped in DisclosureButton */}
            <>
              {navLinks.map((link) => (
                <DisclosureButton
                  as={Link}
                  key={link.tradKey}
                  href={link.url}
                  className={cn(
                    'py-6 text-center text-xl',
                    pathname === link.url
                      ? 'text-accent font-bold'
                      : 'text-foreground/60 font-medium',
                  )}
                >
                  {t(`navigation.${link.tradKey}`)}
                </DisclosureButton>
              ))}
            </>

            {/* Logged Nav */}
            <div className="border-foreground/30 flex flex-col items-center gap-4 border-t pt-6">
              {session?.user?.role === 'ADMIN' && (
                <DisclosureButton
                  as={Link}
                  href="/admin"
                  className="block px-4 py-2 text-sm data-focus:text-white"
                >
                  {t('navigation.adminDashboard')}
                </DisclosureButton>
              )}

              <DisclosureButton
                as={Link}
                href="/profile"
                className="block px-4 py-2 text-sm data-focus:text-white"
              >
                {t('navigation.userProfile')}
              </DisclosureButton>

              <DisclosureButton
                as="button"
                type="button"
                className="inline-flex cursor-pointer items-center gap-1 px-4 py-2 text-sm disabled:opacity-50 data-focus:text-white"
                onClick={() => signOut()}
              >
                <SignOutIcon size={20} /> {t('logout')}
              </DisclosureButton>
            </div>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
