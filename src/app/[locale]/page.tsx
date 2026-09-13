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
        className="mx-auto w-full max-w-xl px-4 pt-20 pb-3 max-md:pt-5 md:pb-6"
        id="main"
      >
        {/* Both install prompts as one stacked deck; the component renders
            null when nothing is eligible or everything is dismissed. */}
        <PromptStack />
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
