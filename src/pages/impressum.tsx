import Container from "@/components/elements/container";
import Nav from "@/components/nav";
import React, { useState, useEffect } from 'react';
import { GetStaticPropsContext } from 'next'
import { useTranslations } from 'next-intl';

const Impressum = () => {
  const t = useTranslations();
  const [impressum, setImpressum] = useState('');

  useEffect(() => {
    fetch('https://philipbrembeck.com/impressum.txt', {method: "GET"})
      .then(response => response.text())
      .then(text => setImpressum(text))
      .catch(error => console.error(error));
  }, []);

  return (
    <>
    <Nav />
    <Container heading={t('More.imprint')}>
        <p className="small">
        {t('Privacy.germanonly')}
        </p>
    <div dangerouslySetInnerHTML={{ __html: impressum }} />
    </Container>
    </>
  );
};

export default Impressum;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../locales/${locale}.json`)).default
    }
  };
}
