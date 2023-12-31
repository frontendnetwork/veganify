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
          href="https://www.producthunt.com/posts/vegancheck-me?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-vegancheck&#0045;me"
          target="_blank"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=396704&theme=neutral"
            alt="VeganCheck.me | Product Hunt"
            height="30"
          />
        </a>
        &nbsp;
        <a
          href="https://www.producthunt.com/posts/vegancheck-me?utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-vegancheck&#0045;me"
          target="_blank"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=396704&theme=neutral&period=weekly&topic_id=43"
            alt="VeganCheck.me | Product Hunt"
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
        </a>) : (
        <a href="https://vegancheck.me">
          <Image
            src="../img/VeganCheck_text.svg"
            alt="VeganCheck.me Logo"
            className="labels"
            width={48}
            height={48}
          />
        </a>
        )}
        <a href="https://github.com/frontendnetwork/vegancheck.me">
          <Image
            src="../img/opensource.svg"
            alt="Open Source"
            className="labels"
            width={48}
            height={48}
          />
        </a>
        <a href="https://www.thegreenwebfoundation.org/green-web-check/?url=https%3A%2F%2Fvegancheck.me">
          <Image
            src="../img/greenhosted.svg"
            alt="Hosted Green"
            className="labels"
            width={48}
            height={48}
          />
        </a>
        <a href="https://iplantatree.org/user/VeganCheck.me">
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
