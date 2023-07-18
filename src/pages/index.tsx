import { GetStaticPropsContext } from "next";

import ProductSearch from "@/components/check";
import InstallPrompt from "@/components/elements/pwainstall";
import Shortcut from "@/components/elements/shortcutinstall";
import Footer from "@/components/footer";
import Nav from "@/components/nav";

export default function Home() {
  return (
    <>
      <div id="modal-root"></div>
      <InstallPrompt />
      <Shortcut />
      <Nav />
      <div className="container top" id="mainpage">
        <div id="main">
          <div className="form" id="resscroll">
            <ProductSearch />
          </div>
        </div>
      </div>
      <Footer />
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
