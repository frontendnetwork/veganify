import Image from "next/image";
import { useTranslations } from "next-intl";

function MutedLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      className="text-muted underline-offset-2 hover:text-ink hover:underline"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {label}
    </a>
  );
}

export default function Footer() {
  const t = useTranslations("Footer");
  const isJanuary = new Date().getMonth() === 0;

  return (
    <footer className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 px-4 pt-5 pb-28 text-muted text-xs md:pb-8">
      <a
        href="https://www.producthunt.com/products/vegancheck-me?utm_source=badge-featured&utm_medium=badge"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Image
          alt="Veganify | Product Hunt"
          className="h-[1.875rem] w-auto opacity-90 transition-opacity hover:opacity-100 motion-reduce:transition-none"
          height={54}
          src="../img/ph_neutral.svg"
          width={250}
        />
      </a>

      <p className="text-balance text-center">
        {t.rich("credit", {
          heart: () => (
            <span
              aria-hidden="true"
              className="inline-block align-baseline text-danger"
            >
              ♥
            </span>
          ),
          jokeLink: (chunks) => (
            <a
              className="font-medium text-link underline-offset-2 hover:underline"
              href="https://frontendnet.work"
              rel="noopener noreferrer"
              target="_blank"
            >
              {chunks}
            </a>
          ),
          philipLink: (chunks) => (
            <a
              className="font-medium text-link underline-offset-2 hover:underline"
              href="https://philipbrembeck.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              {chunks}
            </a>
          ),
        })}
      </p>

      <p className="text-center">
        <MutedLink href="https://uptimerobot.com" label={t("sponsor")} />
        <span aria-hidden="true"> · </span>
        <MutedLink
          href="https://github.com/frontendnetwork/veganify"
          label={t("opensource")}
        />
        <span aria-hidden="true"> · </span>
        <MutedLink
          href="https://iplantatree.org/user/Veganify"
          label={t("carbonneutral")}
        />
        {isJanuary ? (
          <>
            <span aria-hidden="true"> · </span>
            <MutedLink href="https://vegc.net/veganuary" label="Veganuary" />
          </>
        ) : null}
      </p>
    </footer>
  );
}
