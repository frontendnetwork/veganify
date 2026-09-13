import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import ProductSearch from "@/components/Check/index";
import InstallPrompt from "@/components/elements/pwainstall";
import Shortcut from "@/components/elements/shortcutinstall";
import Footer from "@/components/footer";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  description: "Scan barcodes to check if products are vegan",
  title: "Veganify - Check if products are vegan",
};

export default function Home() {
  const t = useTranslations("Check");
  return (
    <>
      <InstallPrompt />
      <Shortcut />
      <main
        className="mx-auto w-full max-w-xl px-4 pt-20 pb-3 max-md:pt-5 md:pb-6"
        id="main"
      >
        <div className="rounded-2xl bg-surface p-5 shadow-elev-2 sm:p-8">
          <div className="mb-5 flex justify-center text-link">
            <Logo className="size-12" />
          </div>
          <h1 className="sr-only-focusable">Veganify</h1>
          <p className="mb-5 text-center text-muted text-sm">{t("tagline")}</p>
          <ProductSearch />
        </div>
      </main>
      <Footer />
    </>
  );
}
