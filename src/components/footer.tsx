import Image from "next/image";
import { useTranslations } from "next-intl";

interface FooterLinkProps {
  alt: string;
  className?: string;
  height?: number;
  href: string;
  src: string;
  width?: number;
}

function FooterLink({
  href,
  src,
  alt,
  className = "labels",
  width = 48,
  height = 48,
}: FooterLinkProps) {
  return (
    <a href={href} rel="noopener noreferrer" target="_blank">
      <Image
        alt={alt}
        className={className}
        height={height}
        src={src}
        width={width}
      />
    </a>
  );
}

interface CreditTextParams {
  heart: string;
  jokeLink: string;
  philipLink: string;
}

export default function Footer() {
  const t = useTranslations("Footer");
  const isJanuary = new Date().getMonth() === 0;

  const creditText = t("credit", {
    heart: '<i class="icon-heart"></i>',
    philipLink: '<a href="https://philipbrembeck.com">Philip Brembeck</a>',
    jokeLink: '<a href="https://frontendnet.work">FrontEndNet.work</a>',
  } satisfies CreditTextParams);

  return (
    <footer>
      <a
        href="https://www.producthunt.com/products/vegancheck-me?utm_source=badge-featured&utm_medium=badge"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Image
          alt="Veganify | Product Hunt"
          height={40}
          src="../img/ph_neutral.svg"
          width={182}
        />
      </a>

      <p dangerouslySetInnerHTML={{ __html: creditText }} />

      <FooterLink
        alt="Sponsored by UptimeRobot"
        href="https://uptimerobot.com"
        src="../img/uptimerobot-logo.svg"
      />

      <FooterLink
        alt={isJanuary ? "Go to Veganuary" : "Veganify Logo"}
        href={isJanuary ? "https://vegc.net/veganuary" : "https://veganify.app"}
        src={isJanuary ? "../img/veganuary.svg" : "../img/veganify_text.svg"}
      />

      <FooterLink
        alt="Open Source"
        href="https://github.com/frontendnetwork/veganify"
        src="../img/opensource.svg"
      />

      <FooterLink
        alt="We plant trees. We're carbon neutral."
        href="https://iplantatree.org/user/Veganify"
        src="../img/treelabel.svg"
      />
    </footer>
  );
}
