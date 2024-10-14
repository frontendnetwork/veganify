"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

import Container from "@/components/elements/container";
import Nav from "@/components/nav";

export default function Impressum() {
  const t = useTranslations();
  const [impressum, setImpressum] = useState("");

  useEffect(() => {
    fetch("https://philipbrembeck.com/impressum.txt")
      .then((response) => response.text())
      .then((text) => setImpressum(text))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <Nav />
      <Container heading={t("More.imprint")}>
        <p className="small">{t("Privacy.germanonly")}</p>
        <div dangerouslySetInnerHTML={{ __html: impressum }} />
      </Container>
    </>
  );
}
