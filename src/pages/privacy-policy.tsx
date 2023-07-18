import { GetStaticPropsContext } from 'next'
import { useTranslations } from 'next-intl';
import React, { useState, useEffect } from 'react';

import Container from "@/components/elements/container";
import Nav from "@/components/nav";

const PrivacyPolicy = () => {
  const t = useTranslations('Privacy');
  const [datenschutz, setDatenschutz] = useState('');

  useEffect(() => {
    fetch('https://philipbrembeck.com/datenschutz.txt')
      .then(response => response.text())
      .then(text => setDatenschutz(text))
      .catch(error => console.error(error));
  }, []);

  return (
    <>
    <Nav />
    <Container>
        <p className="small">
        {t('germanonly')}
        </p>
    <div className="privacy" dangerouslySetInnerHTML={{ __html: datenschutz }} />
    </Container>
    </>
  );
};

export default PrivacyPolicy;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../locales/${locale}.json`)).default
    }
  };
}
