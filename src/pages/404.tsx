import { GetStaticPropsContext } from 'next'
import { useTranslations } from 'next-intl';

import Container from "@/components/elements/container";
import Nav from "@/components/nav";

export default function NotFound() {
  const t = useTranslations('404');
  return (
    <>
      <Nav />
      <Container heading={t('error404')}>
        <p>{t('pagedoesnotexist')}</p>
        <p dangerouslySetInnerHTML={{ __html: t('message', {statuspage: `<a href="https://stats.uptimerobot.com/LY1gRuP5j6/789004495">${t('statuspage')}</a>`, mastodon: '<a href="https://veganism.social/@vegancheck">Mastodon</a>'})}} />
      </Container>
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../locales/${locale}.json`)).default
    }
  };
}
