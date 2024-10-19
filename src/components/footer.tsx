/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useTranslations } from "next-intl";

const FooterLink = ({
  href,
  src,
  alt,
  className = "labels",
  width = 48,
  height = 48,
}: {
  href: string;
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}) => (
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

export default function Footer() {
  const t = useTranslations("Footer");
  const isJanuary = new Date().getMonth() === 0;

  const renderCreditText = () => ({
    __html: t("credit", {
      heart: '<i class="icon-heart"></i>',
      philipLink: '<a href="https://philipbrembeck.com">Philip Brembeck</a>',
      jokeLink: '<a href="https://frontendnet.work">FrontEndNet.work</a>',
    }),
  });

  return (
    <footer>
      <a
        href="https://www.producthunt.com/products/vegancheck-me?utm_source=badge-featured&utm_medium=badge"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=396704&theme=neutral&period=weekly&topic_id=43"
          alt="Veganify | Product Hunt"
          height="30"
        />
      </a>
      <p dangerouslySetInnerHTML={renderCreditText()} />
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
