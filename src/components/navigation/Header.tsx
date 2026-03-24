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
import { List, SignIn, SignOut, X } from '@phosphor-icons/react';

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const t = useTranslations('Header');

  return (
    <Disclosure as="nav" className={'bg-background fixed inset-x-0 top-0 z-50'}>
      {/* Header */}
      <MaxWidthWrapper>
        <header className="h-header flex items-center justify-between">
          <div className="flex">
            <Logo />

            {/* Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {/** Here goes the navigation links */}
            </div>
          </div>

          {/* Lang & Theme */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:gap-4">
            <ThemeToggle />
            <LocaleSwitch />

            {/* DropDown */}
            {session ? (
              <Menu as="div" className="relative">
                <div>
                  <MenuButton className="hover:border-element relative flex cursor-pointer rounded-full border border-transparent text-sm duration-150 focus:outline-none">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">{t('openUserMenu')}</span>
                    <Image
                      alt="avatar"
                      src={session?.user.image ? session.user.image : '/no-avatar.webp'}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
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
                        className="data-[focus]:bg-alternative data-[focus]:text-background block px-4 py-2 text-sm"
                      >
                        Admin
                      </Link>
                    </MenuItem>
                  )}

                  <MenuItem>
                    <button
                      className="data-[focus]:bg-alternative data-[focus]:text-background flex w-full cursor-pointer items-center gap-2 px-4 pt-2.5 pb-2 text-sm"
                      onClick={() => signOut()}
                    >
                      <SignOut size={20} weight="bold" />
                      <span className="hidden md:flex">{t('logout')}</span>
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              <button
                className="text-background bg-alternative hover:bg-foreground cursor-pointer rounded-md px-4 py-2 duration-150"
                onClick={() => signIn('google')}
              >
                <SignIn className="flex md:hidden" size={20} weight="bold" />
                <span className="hidden md:flex">{t('login')}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 focus:outline-none">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">{t('openMainMenu')}</span>
              <List aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
              <X aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
        </header>
      </MaxWidthWrapper>

      {/* Mobile Menu */}
      <DisclosurePanel className="h-page sm:hidden">
        <div className="space-y-1 pt-2 pb-3">
          {/** Here goes the navigation links wrapped in DisclosureButton */}
          {session?.user?.role === 'ADMIN' && (
            <DisclosureButton
              as={Link}
              href="/admin"
              className={cn(
                'block w-full border-l-4 py-2 pr-4 pl-3 text-base font-medium',
                pathname === '/admin' ? 'border-foreground' : 'border-transparent',
              )}
            >
              Admin
            </DisclosureButton>
          )}
        </div>
        <div className="border-alternative border-t pt-4 pb-3">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <Image
                alt="avatar"
                src={session?.user.image ? session.user.image : '/no-avatar.webp'}
                width={36}
                height={36}
                className="rounded-full"
              />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">{session?.user.name}</div>
              <div className="text-sm font-medium text-gray-500">{session?.user.email}</div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <DisclosureButton
              className="block px-4 py-2 text-base font-medium"
              onClick={() => signOut()}
            >
              {t('logout')}
            </DisclosureButton>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
