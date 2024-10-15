import { Metadata } from "next";

import ProductSearch from "@/components/check";
import InstallPrompt from "@/components/elements/pwainstall";
import Shortcut from "@/components/elements/shortcutinstall";
import Footer from "@/components/footer";
import Nav from "@/components/nav";

export const metadata: Metadata = {
  title: "Veganify - Check if products are vegan",
  description: "Scan barcodes to check if products are vegan",
};

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
