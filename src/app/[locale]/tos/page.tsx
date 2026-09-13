import { useTranslations } from "next-intl";

import Container from "@/components/elements/container";

export default function TOS() {
  const t = useTranslations("TOS");
  return (
    <Container heading={t("tos")}>
      <p className="mb-4 text-muted text-sm">{t("englishgermanonly")}</p>
      <div
        className="prose-legal"
        dangerouslySetInnerHTML={{ __html: t.raw("tos_content") }}
      />
    </Container>
  );
}
