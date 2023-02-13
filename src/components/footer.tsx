import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  return (
    <>
      <footer>
        <p dangerouslySetInnerHTML={{ __html: t('credit', {heart: '<i class="icon-heart"></i>', philipLink: '<a href="https://philipbrembeck.com">Philip Brembeck</a>', jokeLink: '<a href="https://jokenetwork.de">JokeNetwork</a>'})}} />
        <a href="https://vegancheck.me">
          <Image
            src="../img/VeganCheck_text.svg"
            alt="VeganCheck.me Logo"
            className="labels"
            width={48}
            height={48}
          />
        </a>
        <a href="https://github.com/jokenetwork/vegancheck.me">
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
