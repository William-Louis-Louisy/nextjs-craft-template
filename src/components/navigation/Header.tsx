import { Link } from "@/i18n/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import Logo from "../commons/Logo";
import { useTranslations } from "next-intl";
import LocaleSwitch from "../commons/LocaleSwitch";
import MaxWidthWrapper from "../commons/MaxWidthWrapper";
import { SignIn, SignOut } from "@phosphor-icons/react";
import ThemeToggle from "../commons/ThemeToggle";

export default function Header() {
  const { data: session } = useSession();
  const t = useTranslations("Header");

  return (
    <MaxWidthWrapper>
      <header className="bg-background h-header w-full flex justify-between items-center">
        <Logo />

        <div className="flex items-center gap-2">
          {session ? (
            <>
              {session.user?.role === "ADMIN" && (
                <Link href="/admin" className="mr-4">
                  Admin
                </Link>
              )}
              <button
                className="cursor-pointer text-background bg-alternative hover:bg-foreground duration-150 px-4 py-2 rounded-md"
                onClick={() => signOut()}
              >
                <SignOut className="flex md:hidden" size={20} weight="bold" />
                <span className="hidden md:flex">{t("logout")}</span>
              </button>
            </>
          ) : (
            <button
              className="cursor-pointer text-background bg-alternative hover:bg-foreground duration-150 px-4 py-2 rounded-md"
              onClick={() => signIn("google")}
            >
              <SignIn className="flex md:hidden" size={20} weight="bold" />
              <span className="hidden md:flex">{t("login")}</span>
            </button>
          )}
          <LocaleSwitch />
          <ThemeToggle />
        </div>
      </header>
    </MaxWidthWrapper>
  );
}
