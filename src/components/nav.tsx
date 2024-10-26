"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/routing";

const NavItem = ({
  href,
  iconClass,
  translationKey,
  isActive,
}: {
  href: string;
  iconClass: string;
  translationKey: string;
  isActive: boolean;
}) => (
  <div className={`flex-item ${isActive ? "active" : ""}`}>
    <Link href={href}>
      <span className={`icon ${iconClass}`}></span>
      <span className="menu-item">{translationKey}</span>
    </Link>
  </div>
);

export default function Nav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();

  const navItems = [
    { href: "/", iconClass: "icon-vegancheck", translationKey: t("home") },
    {
      href: "/ingredients",
      iconClass: "icon-ingredients",
      translationKey: t("ingredientcheck"),
    },
    { href: "/more", iconClass: "icon-ellipsis", translationKey: t("more") },
  ];

  const isMoreActive = [
    "/more",
    "/tos",
    "/privacy-policy",
    "/impressum",
  ].includes(pathname);

  return (
    <nav className="nav">
      <div className="flex-container">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            iconClass={item.iconClass}
            translationKey={item.translationKey}
            isActive={
              item.href === "/more" ? isMoreActive : pathname === item.href
            }
          />
        ))}
      </div>
    </nav>
  );
}
