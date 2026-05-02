"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";

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
    <Link href={href} prefetch={true}>
      <span className={`icon ${iconClass}`} />
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
            href={item.href}
            iconClass={item.iconClass}
            isActive={
              item.href === "/more" ? isMoreActive : pathname === item.href
            }
            key={item.href}
            translationKey={item.translationKey}
          />
        ))}
      </div>
    </nav>
  );
}
