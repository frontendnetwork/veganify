import Container from "@/components/elements/container";
import Nav from "@/components/nav";
import { GetStaticPropsContext } from 'next'
import { useTranslations } from 'next-intl';

function fallback() {
  const t = useTranslations('Fallback');
  return (
    <>
      <Nav />
      <Container
        heading={t('yourareoffline')}
        backbutton="false"
      >
        <p>
          {t('needinternet')}<br />
          <a href="/">{t('tryagain')}</a>
        </p>
      </Container>
    </>
  );
}
 export default fallback;

 export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`..//locales/${locale}.json`)).default
    }
  };
}
