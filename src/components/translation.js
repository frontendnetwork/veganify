
export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`/locales/${locale}.json`),
    },
  };
}
