import { useTranslations } from "next-intl";

import Container from "@/components/elements/container";

export default function TOS() {
  const t = useTranslations("TOS");
  return (
    <>
      <Container heading={t("tos")}>
        <p className="small">{t("englishgermanonly")}</p>
        <div dangerouslySetInnerHTML={{ __html: t.raw("tos_content") }} />
      </Container>
    </>
  );
}
