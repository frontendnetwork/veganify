"use client";

import {
  BookOpen,
  ChevronRight,
  Coffee,
  FileText,
  Globe,
  Heart,
  Info,
  Shield,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  type ComponentType,
  type ReactNode,
  type SVGProps,
  useCallback,
  useEffect,
  useState,
} from "react";

import Container from "@/components/elements/container";
import SupportOption from "@/components/elements/contents/donate";
import { AppDialog as Dialog } from "@/components/ui/app-dialog";
import { Switch } from "@/components/ui/switch";
import { Link } from "@/i18n/navigation";
import { setLocaleCookie } from "@/lib/locale-cookie";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", name: "english" },
  { code: "de", name: "german" },
  { code: "es", name: "spanish" },
  { code: "fr", name: "french" },
  { code: "pl", name: "polish" },
  { code: "cz", name: "czech" },
  { code: "pt-br", name: "portuguese-br" },
] as const;

function ListRow({
  icon: Icon,
  label,
  onClick,
  href,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const inner = (
    <>
      <Icon aria-hidden="true" className="size-5 shrink-0 text-muted" />
      <span className="flex-1 text-left font-medium">{label}</span>
      <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted" />
    </>
  );
  const className = cn(
    "fluid-hover flex w-full items-center gap-3 rounded-lg px-3 py-3 text-ink text-sm hover:bg-surface-2"
  );

  if (href) {
    return (
      <a
        className={className}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {inner}
      </a>
    );
  }
  return (
    <button className={className} onClick={onClick} type="button">
      {inner}
    </button>
  );
}

export default function More() {
  const t = useTranslations("More");
  const tNav = useTranslations("Nav");
  const currentLocale = useLocale();
  const [donateOpen, setDonateOpen] = useState(false);
  const [followOpen, setFollowOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const openDonate = useCallback(() => setDonateOpen(true), []);
  const openFollow = useCallback(() => setFollowOpen(true), []);
  const openLanguage = useCallback(() => setLanguageOpen(true), []);
  const handleLanguageChange = useCallback((locale: string) => {
    setLocaleCookie(locale);
  }, []);

  return (
    <Container backButton={false} heading={tNav("more")} logo={false}>
      <div className="flex flex-col">
        <ListRow icon={Coffee} label={t("buyusacoffee")} onClick={openDonate} />
        <ListRow icon={Heart} label={t("followus")} onClick={openFollow} />
        <div className="my-1 border-line border-t" />
        <Link
          className="fluid-hover flex items-center gap-3 rounded-lg px-3 py-3 text-ink text-sm hover:bg-surface-2"
          href="/tos"
          prefetch={true}
        >
          <FileText aria-hidden="true" className="size-5 shrink-0 text-muted" />
          <span className="flex-1 font-medium">{t("tos")}</span>
          <ChevronRight
            aria-hidden="true"
            className="size-4 shrink-0 text-muted"
          />
        </Link>
        <Link
          className="fluid-hover flex items-center gap-3 rounded-lg px-3 py-3 text-ink text-sm hover:bg-surface-2"
          href="/privacy-policy"
          prefetch={true}
        >
          <Shield aria-hidden="true" className="size-5 shrink-0 text-muted" />
          <span className="flex-1 font-medium">{t("privacypolicy")}</span>
          <ChevronRight
            aria-hidden="true"
            className="size-4 shrink-0 text-muted"
          />
        </Link>
        <ListRow
          href="https://frontendnet.work/veganify-api"
          icon={BookOpen}
          label={t("apidocumentation")}
        />
        <Link
          className="fluid-hover flex items-center gap-3 rounded-lg px-3 py-3 text-ink text-sm hover:bg-surface-2"
          href="/impressum"
          prefetch={true}
        >
          <Info aria-hidden="true" className="size-5 shrink-0 text-muted" />
          <span className="flex-1 font-medium">{t("imprint")}</span>
          <ChevronRight
            aria-hidden="true"
            className="size-4 shrink-0 text-muted"
          />
        </Link>
        <ListRow icon={Globe} label={t("language")} onClick={openLanguage} />
        <div className="mt-2 border-line border-t pt-4">
          <OLEDRow />
        </div>
      </div>

      <Dialog
        onOpenChange={setDonateOpen}
        open={donateOpen}
        title={t("buyusacoffee")}
      >
        <SupportOption />
      </Dialog>

      <Dialog
        onOpenChange={setFollowOpen}
        open={followOpen}
        title={t("followus")}
      >
        <ul className="flex flex-col gap-1">
          {[
            { href: "https://veganism.social/@vegancheck", label: "Mastodon" },
            { href: "https://instagram.com/veganify.app", label: "Instagram" },
          ].map((item) => (
            <li key={item.label}>
              <a
                className="fluid-hover flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-ink text-sm hover:bg-surface-2"
                href={item.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </Dialog>

      <Dialog
        description={t("thissetsacookie")}
        onOpenChange={setLanguageOpen}
        open={languageOpen}
        title={t("language")}
      >
        <div className="flex flex-col gap-1">
          {languages.map(({ code, name }) => (
            <LanguageOption
              code={code}
              isCurrent={currentLocale === code}
              key={code}
              label={t(name)}
              onLocaleChange={handleLanguageChange}
              srCurrent={t("currentlanguage")}
            />
          ))}
        </div>
      </Dialog>
    </Container>
  );
}

function OLEDRow(): ReactNode {
  const t = useTranslations("More");
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem("oled") === "true") {
      setIsChecked(true);
    }
  }, []);

  const handleClick = useCallback(() => {
    const isDarkModePreferred = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (!(isChecked || isDarkModePreferred)) {
      setError(true);
      return;
    }

    if (isChecked) {
      localStorage.removeItem("oled");
      document.documentElement.removeAttribute("data-theme");
      updateThemeColor("#13171e");
    } else {
      document.documentElement.setAttribute("data-theme", "oled");
      localStorage.setItem("oled", "true");
      updateThemeColor("#000000");
    }

    setIsChecked((prevChecked) => !prevChecked);
    setError(false);
  }, [isChecked]);

  return (
    <div className="flex items-center justify-between gap-3 px-3 py-3">
      <div>
        <p className="font-medium text-ink text-sm">OLED-Mode</p>
        <p className="text-muted text-xs">{t("thissetsacookie")}</p>
        {error ? (
          <p aria-live="polite" className="mt-1 text-caution text-xs">
            {t("activatedarkmode")}
          </p>
        ) : null}
      </div>
      <Switch
        checked={isChecked}
        className="[&>span]:sr-only"
        label="OLED-Mode"
        onToggle={handleClick}
      />
    </div>
  );
}

function LanguageOption({
  code,
  isCurrent,
  label,
  onLocaleChange,
  srCurrent,
}: {
  code: (typeof languages)[number]["code"];
  isCurrent: boolean;
  label: string;
  onLocaleChange: (locale: string) => void;
  srCurrent: string;
}) {
  const handleClick = useCallback(
    () => onLocaleChange(code),
    [code, onLocaleChange]
  );

  return (
    <Link
      className="fluid-hover flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 font-medium text-ink text-sm hover:bg-surface-2"
      href="/more"
      locale={code}
      onClick={handleClick}
    >
      {label}
      {isCurrent ? (
        <>
          <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
          <span className="sr-only-focusable">{srCurrent}</span>
        </>
      ) : null}
    </Link>
  );
}

function updateThemeColor(color: string) {
  document
    .querySelector<HTMLMetaElement>(
      'meta[name="theme-color"][media="(prefers-color-scheme: dark)"]'
    )
    ?.setAttribute("content", color);
}
