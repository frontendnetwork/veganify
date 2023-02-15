import { GetStaticProps } from 'next';

interface Props {
  messages: Record<string, string>;
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  return {
    props: {
      messages: require(`locales/${locale}.json`),
    },
  };
};
