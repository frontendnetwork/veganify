import { getTranslations } from "next-intl/server";

import Container from "@/components/elements/container";

async function getImpressum() {
  try {
    const response = await fetch("https://philipbrembeck.com/impressum.txt");
    if (!response.ok) {
      throw new Error(`Failed to fetch impressum: ${response.status}`);
    }
    return response.text();
  } catch (error) {
    console.error("Failed to fetch impressum:", error);
    return "";
  }
}

export default async function Impressum() {
  const t = await getTranslations();
  const impressum = await getImpressum();

  return (
    <Container heading={t("More.imprint")}>
      <p className="small">{t("Privacy.germanonly")}</p>
      <div dangerouslySetInnerHTML={{ __html: impressum }} />
    </Container>
  );
}
