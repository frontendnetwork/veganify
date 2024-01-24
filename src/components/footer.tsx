/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  const d = new Date().getMonth();
  return (
    <>
      <footer>
        <a
          href="https://www.producthunt.com/products/vegancheck-me?utm_source=badge-featured&utm_medium=badge"
          target="_blank"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=396704&theme=neutral"
            alt="Veganify | Product Hunt"
            height="30"
          />
        </a>
        <p
          dangerouslySetInnerHTML={{
            __html: t("credit", {
              heart: '<i class="icon-heart"></i>',
              philipLink:
                '<a href="https://philipbrembeck.com">Philip Brembeck</a>',
              jokeLink:
                '<a href="https://frontendnet.work">FrontEndNet.work</a>',
            }),
          }}
        />
        {d === 0 ? (
          <a href="https://vegc.net/veganuary">
            <Image
              src="../img/veganuary.svg"
              alt="Go to Veganuary"
              className="labels"
              width={48}
              height={48}
            />
          </a>
        ) : (
          <a href="https://veganify.app">
            <Image
              src="../img/veganify_text.svg"
              alt="Veganify Logo"
              className="labels"
              width={48}
              height={48}
            />
          </a>
        )}
        <a href="https://github.com/frontendnetwork/veganify">
          <Image
            src="../img/opensource.svg"
            alt="Open Source"
            className="labels"
            width={48}
            height={48}
          />
        </a>
        <a href="https://www.thegreenwebfoundation.org/green-web-check/?url=https%3A%2F%2Fveganify.app">
          <Image
            src="../img/greenhosted.svg"
            alt="Hosted Green"
            className="labels"
            width={48}
            height={48}
          />
        </a>
        <a href="https://iplantatree.org/user/Veganify">
          <Image
            src="../img/treelabel.svg"
            alt="We plant trees. We're carbon neutral."
            className="labels"
            width={48}
            height={48}
          />
        </a>
      </footer>
    </>
  );
}
