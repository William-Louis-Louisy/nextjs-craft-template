import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("HomePage");
  return (
    <div className="min-h-page mx-auto max-w-7xl flex flex-col items-center gap-8 pt-12">
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
}
