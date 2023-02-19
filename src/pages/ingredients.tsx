import Nav from "@/components/nav";
import IngredientsCheck from '@/components/ingredientscheck'
import Container from "@/components/elements/container";
import { GetStaticPropsContext } from "next";

export default function ingredients() {
  return (
    <>
      <div id="modal-root"></div>
      <Nav />
      <Container
        logo="false"
        backbutton="false"
      >
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
