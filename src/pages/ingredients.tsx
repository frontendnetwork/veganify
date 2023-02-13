import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/nav";
import IngredientsCheck from '@/components/ingredientscheck'
import Container from "@/components/elements/container";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";

export default function ingredients() {
  const t = useTranslations('Ingredients');
  return (
    <>
      <div id="modal-root"></div>
      <Nav />
      <Container
        heading={t('ingredientcheck')}
        headingstyle="center"
        logo="true"
        backbutton="false"
      >
        <p style={{textAlign: "center"}}>{t('ingredientcheck_desc')}</p>
        <IngredientsCheck />
      </Container>
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../locales/${locale}.json`)).default,
    },
  };
}
