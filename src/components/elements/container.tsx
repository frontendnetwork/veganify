import type { ReactNode } from "react";

import BackButton from "@/components/button_back";
import { Logo } from "@/components/ui/logo";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface ContainerProps {
  backButton?: boolean;
  children: ReactNode;
  className?: string;
  heading?: string;
  logo?: boolean;
}

/**
 * The shared page column: one card on a page-colored ground, inside one
 * <main> landmark per page. Bottom tab bar clearance on mobile.
 */
export default function Container({
  heading,
  backButton = true,
  logo = true,
  className,
  children,
}: Readonly<ContainerProps>) {
  return (
    <main
      className="mx-auto w-full max-w-xl px-4 pt-20 pb-6 max-md:pt-6 md:pb-12"
      id="main"
    >
      <div
        className={cn(
          "rounded-2xl bg-surface p-5 shadow-elev-2 sm:p-8",
          "max-md:mb-2",
          className
        )}
      >
        <div className="flex items-start justify-between">
          {!!logo && (
            <Link
              aria-label="Veganify"
              className="mb-4 block text-link"
              href="/"
              prefetch={true}
            >
              <Logo className="size-10" />
            </Link>
          )}
          {!!backButton && <BackButton className="-mt-2 -mr-2" />}
        </div>
        {!!heading && (
          <h1 className="mb-4 text-balance font-semibold text-xl">{heading}</h1>
        )}
        {children}
      </div>
    </main>
  );
}
