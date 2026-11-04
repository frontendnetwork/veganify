import { useTranslations } from "next-intl";

import ProductSearch from "@/components/Check/index";
import PromptStack from "@/components/elements/prompt-stack";
import Footer from "@/components/footer";
import { Logo } from "@/components/ui/logo";

export default function Home() {
  const t = useTranslations("Check");
  return (
    <>
      <main
        className="mx-auto w-full max-w-xl px-4 pt-20 pb-3 max-md:pt-4 md:pb-6"
        id="main"
      >
        {/* Both install prompts as one stacked deck; the component renders
            null when nothing is eligible or everything is dismissed. */}
        <PromptStack />
        <div className="bg-surface shadow-elev-2 rounded-2xl p-5 sm:p-8">
          <div className="text-link mb-5 flex justify-center">
            <Logo className="size-12" />
          </div>
          <h1 className="sr-only-focusable">Veganify</h1>
          <p className="text-muted mb-5 text-center text-sm">{t("tagline")}</p>
          <ProductSearch />
        </div>
      </main>
      <Footer />
    </>
  );
}
