"use client";

import { BadgeCheck, Leaf, ScanBarcode } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  type ComponentType,
  type SVGProps,
  useCallback,
  useEffect,
  useState,
} from "react";

import { loadRecentChecks } from "./recentChecks";

/** Verified to return a full vegan result from the live API. */
const EXAMPLE_EAN = "7394376616037";

function Step({
  icon: Icon,
  title,
  description,
  isLast,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  isLast: boolean;
}) {
  return (
    <li className="grid grid-cols-[2.5rem_1fr] gap-x-3">
      <div className="relative flex justify-center">
        <span className="z-10 flex size-10 items-center justify-center rounded-full bg-surface-2 text-muted">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        {!isLast && (
          <span
            aria-hidden="true"
            className="absolute top-10 bottom-0 w-px bg-line"
          />
        )}
      </div>
      <div className="pt-1.5 pb-6">
        <p className="font-medium text-ink text-sm">{title}</p>
        <p className="mt-0.5 text-muted text-sm leading-snug">{description}</p>
      </div>
    </li>
  );
}

/**
 * First-run home state: teaches the scan → verdict → details flow, ending in
 * a tappable example. Replaced by Recently-checked once the user has scanned.
 */
export function EmptyState({
  onSelectExample,
}: {
  onSelectExample: (ean: string) => void;
}) {
  const t = useTranslations("Check");
  const [hasRecents, setHasRecents] = useState(true);

  // The tutorial yields to "Recently checked" once the user has scans to
  // return to — first visit teaches, every visit after is utility.
  useEffect(() => {
    setHasRecents(loadRecentChecks().length > 0);
  }, []);

  const selectExample = useCallback(
    () => onSelectExample(EXAMPLE_EAN),
    [onSelectExample]
  );

  if (hasRecents) {
    return null;
  }

  return (
    <div className="mt-8 border-line border-t pt-6">
      <p className="mb-4 font-medium text-muted text-sm">{t("howitworks")}</p>
      <ol>
        <Step
          description={t("step1d")}
          icon={ScanBarcode}
          isLast={false}
          title={t("step1t")}
        />
        <Step
          description={t("step2d")}
          icon={Leaf}
          isLast={false}
          title={t("step2t")}
        />
        <Step
          description={t("step3d")}
          icon={BadgeCheck}
          isLast={true}
          title={t("step3t")}
        />
      </ol>
      <button
        className="fluid-hover -mt-1 rounded-full border border-line-strong bg-surface px-4 py-2 font-medium text-ink text-sm hover:bg-surface-2 motion-safe:transition-transform motion-safe:active:scale-[0.97]"
        onClick={selectExample}
        type="button"
      >
        {t("tryexample")}
      </button>
    </div>
  );
}
