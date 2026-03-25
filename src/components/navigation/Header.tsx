'use client';

import {
  CloseButton,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import {
  XIcon,
  ListIcon,
  UserIcon,
  SignInIcon,
  SignOutIcon,
  SpinnerIcon,
} from '@phosphor-icons/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { signIn, signOut, useSession } from 'next-auth/react';

import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

import LocaleSwitch from '../commons/LocaleSwitch';
import Logo from '../commons/Logo';
import MaxWidthWrapper from '../commons/MaxWidthWrapper';
import ThemeToggle from '../commons/ThemeToggle';

export const navLinks = [
  { tradKey: 'about', url: '#' },
  { tradKey: 'faq', url: '#' },
  { tradKey: 'contact', url: '#' },
] as const;

type NavLink = (typeof navLinks)[number];

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const t = useTranslations('Header');

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const isUnauthenticated = status === 'unauthenticated';

  const isLinkActive = (currentPath: string, url: string) => {
    if (url === '/') return currentPath === '/';
    return currentPath === url || currentPath.startsWith(`${url}/`);
  };

  const handleSignIn = () => {
    void signIn('google');
  };

  const handleSignOut = () => {
    void signOut({ callbackUrl: '/' });
  };

  const avatarAlt = session?.user?.name ? `${session.user.name} avatar` : 'User avatar';

  const renderDesktopNavLink = (link: NavLink) => {
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
  };

  const renderMobileNavLink = (link: NavLink) => {
    const active = isLinkActive(pathname, link.url);

    return (
      <CloseButton
        as={Link}
        key={link.tradKey}
        href={link.url}
        className={cn(
          'py-6 text-center text-xl',
          active ? 'text-accent font-bold' : 'text-foreground/60 font-medium',
        )}
      >
        {t(`navigation.${link.tradKey}`)}
      </CloseButton>
    );
  };

  return (
    <Disclosure as="nav" className="bg-background fixed inset-x-0 top-0 z-50">
      <MaxWidthWrapper>
        <header className="h-header flex items-center justify-between">
          <div className="flex">
            <Logo />
          </div>

          {/* Navigation */}
          <div className="hidden items-center justify-center lg:ml-6 lg:grid lg:grid-cols-3">
            {navLinks.map(renderDesktopNavLink)}
          </div>

          {/* Desktop: Lang / Theme / Auth */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:gap-4">
            <ThemeToggle />
            <LocaleSwitch />

            {isLoading && <SpinnerIcon size={20} className="animate-spin" />}

            {isAuthenticated && (
              <Menu as="div" className="relative">
                <MenuButton className="relative flex cursor-pointer rounded-full text-sm focus:outline-none">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">{t('openUserMenu')}</span>
                  <span className="bg-element flex size-10 items-center justify-center rounded-full p-2">
                    {session?.user?.image ? (
                      <Image
                        alt={avatarAlt}
                        src={session.user.image}
                        width={36}
                        height={36}
                        className="rounded-full"
                      />
                    ) : (
                      <UserIcon weight="bold" size={20} />
                    )}
                  </span>
                </MenuButton>

                <MenuItems
                  transition
                  className="bg-element absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-0 transition focus:outline-none data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  {session?.user?.role === 'ADMIN' && (
                    <MenuItem>
                      {({ close }) => (
                        <Link
                          href="/admin"
                          onClick={close}
                          className="data-focus:bg-alternative data-focus:text-background block px-4 py-2 text-sm"
                        >
                          {t('navigation.adminDashboard')}
                        </Link>
                      )}
                    </MenuItem>
                  )}

                  <MenuItem>
                    {({ close }) => (
                      <Link
                        href="/profile"
                        onClick={close}
                        className="data-focus:bg-alternative data-focus:text-background block px-4 py-2 text-sm"
                      >
                        {t('navigation.userProfile')}
                      </Link>
                    )}
                  </MenuItem>

                  <MenuItem>
                    <button
                      type="button"
                      className="data-focus:bg-alternative data-focus:text-background flex w-full cursor-pointer items-center gap-2 px-4 pt-2.5 pb-2 text-sm"
                      onClick={handleSignOut}
                    >
                      <SignOutIcon size={20} />
                      <span className="hidden md:flex">{t('logout')}</span>
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            )}

            {isUnauthenticated && (
              <button
                type="button"
                className="text-background bg-accent/80 hover:bg-accent hover:text-foreground inline-flex h-10 cursor-pointer items-center gap-1 rounded-md px-4 py-2 duration-150"
                onClick={handleSignIn}
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
        {({ close }) => (
          <div className="space-y-1 pt-2 pb-3">
            <div className="flex h-full flex-col items-center justify-center">
              <div className="absolute right-4 bottom-4 inline-flex items-center gap-4">
                <ThemeToggle />
                <LocaleSwitch />
              </div>

              {navLinks.map(renderMobileNavLink)}

              <div className="border-foreground/30 mt-6 flex flex-col items-center gap-4 border-t pt-6">
                {isLoading && <SpinnerIcon size={20} className="animate-spin" />}

                {isAuthenticated && (
                  <>
                    {session?.user?.role === 'ADMIN' && (
                      <CloseButton
                        as={Link}
                        href="/admin"
                        className="block px-4 py-2 text-sm data-focus:text-white"
                      >
                        {t('navigation.adminDashboard')}
                      </CloseButton>
                    )}

                    <CloseButton
                      as={Link}
                      href="/profile"
                      className="block px-4 py-2 text-sm data-focus:text-white"
                    >
                      {t('navigation.userProfile')}
                    </CloseButton>

                    <button
                      type="button"
                      className="inline-flex cursor-pointer items-center gap-1 px-4 py-2 text-sm disabled:opacity-50 data-focus:text-white"
                      onClick={() => {
                        close();
                        handleSignOut();
                      }}
                    >
                      <SignOutIcon size={20} />
                      {t('logout')}
                    </button>
                  </>
                )}

                {isUnauthenticated && (
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center gap-1 px-4 py-2 text-sm disabled:opacity-50 data-focus:text-white"
                    onClick={() => {
                      close();
                      handleSignIn();
                    }}
                  >
                    <SignInIcon size={20} />
                    {t('login')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </DisclosurePanel>
    </Disclosure>
  );
}
