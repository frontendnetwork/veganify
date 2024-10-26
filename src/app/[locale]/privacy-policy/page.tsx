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
  const t = await getTranslations("Privacy");
  const datenschutz = await getPrivacyPolicy();

  return (
    <Container>
      <p className="small">{t("germanonly")}</p>
      <div
        className="privacy"
        dangerouslySetInnerHTML={{ __html: datenschutz }}
      />
    </Container>
  );
}
