import Image from "next/image";
import { useTranslations } from "next-intl";

interface FooterLinkProps {
  href: string;
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
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
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Image
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
      />
    </a>
  );
}

interface CreditTextParams {
  heart: string;
  philipLink: string;
  jokeLink: string;
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
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="../img/ph_neutral.svg"
          alt="Veganify | Product Hunt"
          width={182}
          height={40}
        />
      </a>

      <p dangerouslySetInnerHTML={{ __html: creditText }} />

      <FooterLink
        href={isJanuary ? "https://vegc.net/veganuary" : "https://veganify.app"}
        src={isJanuary ? "../img/veganuary.svg" : "../img/veganify_text.svg"}
        alt={isJanuary ? "Go to Veganuary" : "Veganify Logo"}
      />

      <FooterLink
        href="https://github.com/frontendnetwork/veganify"
        src="../img/opensource.svg"
        alt="Open Source"
      />

      <FooterLink
        href="https://www.thegreenwebfoundation.org/green-web-check/?url=https%3A%2F%2Fveganify.app"
        src="../img/greenhosted.svg"
        alt="Hosted Green"
      />

      <FooterLink
        href="https://iplantatree.org/user/Veganify"
        src="../img/treelabel.svg"
        alt="We plant trees. We're carbon neutral."
      />
    </footer>
  );
}
