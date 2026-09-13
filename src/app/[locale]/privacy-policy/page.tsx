import { getTranslations } from "next-intl/server";

import Container from "@/components/elements/container";

async function getPrivacyPolicy() {
  try {
    const response = await fetch("https://philipbrembeck.com/datenschutz.txt");
    if (!response.ok) {
      throw new Error(`Failed to fetch privacy policy: ${response.status}`);
    }
    return response.text();
  } catch (error) {
    console.error("Failed to fetch privacy policy:", error);
    return "";
  }
}

export default async function PrivacyPolicy() {
  const t = await getTranslations();
  const datenschutz = await getPrivacyPolicy();

  return (
    <Container heading={t("More.privacypolicy")}>
      <p className="mb-4 text-muted text-sm">{t("Privacy.germanonly")}</p>
      <div
        className="prose-legal"
        dangerouslySetInnerHTML={{ __html: datenschutz }}
      />
    </Container>
  );
}
