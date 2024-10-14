"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/routing";

export default function Nav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();

  return (
    <nav className="nav">
      <div className="flex-container">
        <div className={pathname === "/" ? "flex-item active" : "flex-item"}>
          <Link href="/">
            <span className="icon icon-vegancheck"></span>
            <span className="menu-item">{t("home")}</span>
          </Link>
        </div>
        <div
          className={
            pathname === "/ingredients" ? "flex-item active" : "flex-item"
          }
        >
          <Link href="/ingredients">
            <span className="icon icon-ingredients"></span>
            <span className="menu-item">{t("ingredientcheck")}</span>
          </Link>
        </div>
        <div
          className={
            ["/more", "/tos", "/privacy-policy", "/impressum"].includes(
              pathname
            )
              ? "flex-item active"
              : "flex-item"
          }
        >
          <Link href="/more">
            <span className="icon icon-ellipsis"></span>
            <span className="menu-item">{t("more")}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
