"use client";

import { ClipboardList, Ellipsis } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentType, SVGProps } from "react";
import { Logo } from "@/components/ui/logo";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
}

export default function Nav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();

  const items: NavItem[] = [
    { href: "/", icon: Logo, label: t("home") },
    { href: "/ingredients", icon: ClipboardList, label: t("ingredientcheck") },
    { href: "/more", icon: Ellipsis, label: t("more") },
  ];

  const isMoreActive = [
    "/more",
    "/tos",
    "/privacy-policy",
    "/impressum",
  ].includes(pathname);

  return (
    <nav
      aria-label={t("navigation")}
      className={cn(
        "fixed inset-x-0 z-30 border-line border-b bg-[var(--nav-bg)] backdrop-blur-md",
        "max-md:bottom-0 max-md:border-t max-md:border-b-0",
        "supports-[backdrop-filter]:bg-[var(--nav-bg)]"
      )}
    >
      <ul className="mx-auto flex h-16 max-w-3xl items-stretch justify-around gap-1 px-1 max-md:h-[max(4rem,env(safe-area-inset-bottom)+4rem))] max-md:pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const isActive =
            item.href === "/more" ? isMoreActive : pathname === item.href;
          const Icon = item.icon;
          return (
            <li className="flex-1" key={item.href}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "fluid-hover mx-auto flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 text-muted hover:text-ink",
                  isActive && "text-link hover:text-link"
                )}
                href={item.href}
                prefetch={true}
              >
                <Icon
                  aria-hidden="true"
                  className="size-5 max-md:size-[1.35rem]"
                  strokeWidth={isActive ? 2.4 : 2}
                />
                <span className="font-medium text-[0.8125rem]">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
