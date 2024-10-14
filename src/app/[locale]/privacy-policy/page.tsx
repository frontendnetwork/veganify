"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

import Container from "@/components/elements/container";
import Nav from "@/components/nav";

export default function PrivacyPolicy() {
  const t = useTranslations("Privacy");
  const [datenschutz, setDatenschutz] = useState("");

  useEffect(() => {
    fetch("https://philipbrembeck.com/datenschutz.txt")
      .then((response) => response.text())
      .then((text) => setDatenschutz(text))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <Nav />
      <Container>
        <p className="small">{t("germanonly")}</p>
        <div
          className="privacy"
          dangerouslySetInnerHTML={{ __html: datenschutz }}
        />
      </Container>
    </>
  );
}
