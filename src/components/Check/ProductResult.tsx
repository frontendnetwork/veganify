"use client";

import { Check, CircleHelp, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  type ComponentType,
  type ReactNode,
  type SVGProps,
  useCallback,
  useState,
} from "react";

import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ProductResult } from "@/models/ProductResults";
import type { Sources } from "@/models/Sources";
import ShareButton from "../elements/share";
import LicenseModalContent from "../shared/LicenseModalContent";
import type {
  GradeLetter,
  GradeState,
  ProductState,
  TriState,
} from "./models/product";

interface ProductResultProps {
  barcode: string;
  productState: ProductState;
  result: ProductResult;
  sources: Sources;
}

const gradeStyles: Record<GradeLetter, string> = {
  a: "bg-nutri-a text-nutri-a-fg",
  b: "bg-nutri-b text-nutri-b-fg",
  c: "bg-nutri-c text-nutri-c-fg",
  d: "bg-nutri-d text-nutri-d-fg",
  e: "bg-nutri-e text-nutri-e-fg",
};

const triStateText: Record<TriState, string> = {
  no: "text-danger",
  unknown: "text-muted",
  yes: "text-success",
};

const triStateBg: Record<TriState, string> = {
  no: "bg-danger-surface",
  unknown: "bg-neutral-surface",
  yes: "bg-success-surface",
};

function TriStateGlyph({ state }: { state: TriState }) {
  const t = useTranslations("Check");
  const icons: Record<TriState, ComponentType<SVGProps<SVGSVGElement>>> = {
    no: X,
    unknown: CircleHelp,
    yes: Check,
  };
  const Icon = icons[state];
  const labels: Record<TriState, string> = {
    no: t("no"),
    unknown: t("unknown"),
    yes: t("yes"),
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium",
        triStateText[state]
      )}
    >
      <Icon aria-hidden="true" className="size-4" strokeWidth={2.5} />
      {labels[state]}
    </span>
  );
}

function GradeBadge({
  state,
  srLabel,
}: {
  state: GradeState;
  srLabel: string;
}) {
  if (!state.grade) {
    return <TriStateGlyph state="unknown" />;
  }
  return (
    <span
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md font-bold text-sm uppercase",
        gradeStyles[state.grade]
      )}
    >
      <span className="sr-only-focusable">{`${srLabel} `}</span>
      {state.grade}
    </span>
  );
}

function HelpDialog({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const t = useTranslations("Check");
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  return (
    <>
      <button
        aria-label={t("whatis", { title })}
        className="fluid-hover -ml-1 inline-flex size-7 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-ink"
        onClick={handleOpen}
        type="button"
      >
        <CircleHelp aria-hidden="true" className="size-4" />
      </button>
      <Dialog onOpenChange={setOpen} open={open} title={title}>
        {children}
      </Dialog>
    </>
  );
}

function VerdictRow({
  label,
  help,
  children,
}: {
  label: string;
  help?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-line border-t py-3">
      <dt className="flex items-center gap-0.5 font-medium text-ink">
        {label}
        {help}
      </dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

export function ProductResultView({
  result,
  sources,
  productState,
  barcode,
}: ProductResultProps) {
  const t = useTranslations("Check");
  const [licenseOpen, setLicenseOpen] = useState(false);
  const handleLicenseOpen = useCallback(() => setLicenseOpen(true), []);
  const productname =
    result.productname === "n/a" ? t("unknown") : result.productname;

  const heroLabel: Record<TriState, string> = {
    no: t("notvegan"),
    unknown: t("unknown"),
    yes: t("vegan"),
  };

  return (
    <section className="mt-6">
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-elev-2 sm:p-6">
        <h2 className="mb-4 text-balance font-semibold text-ink text-xl">
          {productname}
        </h2>

        <p
          className={cn(
            "flex h-16 items-center justify-center gap-2.5 rounded-xl font-semibold text-lg",
            triStateBg[productState.vegan],
            triStateText[productState.vegan]
          )}
        >
          {productState.vegan === "yes" && (
            <Check aria-hidden="true" className="size-6" strokeWidth={2.5} />
          )}
          {productState.vegan === "no" && (
            <X aria-hidden="true" className="size-6" strokeWidth={2.5} />
          )}
          {productState.vegan === "unknown" && (
            <CircleHelp
              aria-hidden="true"
              className="size-6"
              strokeWidth={2.5}
            />
          )}
          {heroLabel[productState.vegan]}
        </p>

        <dl className="mt-2 text-sm">
          <VerdictRow label={t("vegetarian")}>
            <TriStateGlyph state={productState.vegetarian} />
          </VerdictRow>
          <VerdictRow
            help={
              <HelpDialog title={t("palmoil")}>
                <p>{t("palmoil_desc")}</p>
              </HelpDialog>
            }
            label={t("palmoil")}
          >
            <TriStateGlyph state={productState.palmoil} />
          </VerdictRow>
          {productState.animaltestfree !== "unknown" && (
            <VerdictRow label={t("crueltyfree")}>
              <TriStateGlyph state={productState.animaltestfree} />
            </VerdictRow>
          )}
          <VerdictRow
            help={
              <HelpDialog title="NutriScore">
                <p>
                  {t.rich("nutriscore_desc", {
                    algorithmwatch: (chunks) => (
                      <a
                        className="text-link underline-offset-2 hover:underline"
                        href="https://algorithmwatch.org/en/nutriscore/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </HelpDialog>
            }
            label="NutriScore"
          >
            <GradeBadge srLabel="NutriScore" state={productState.nutriscore} />
          </VerdictRow>
          <VerdictRow
            help={
              <HelpDialog title={t("grades")}>
                <p>
                  {t.rich("grades_desc", {
                    grades: (chunks) => (
                      <a
                        className="text-link underline-offset-2 hover:underline"
                        href="https://grade.veganify.app"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </HelpDialog>
            }
            label={t("grades")}
          >
            <GradeBadge srLabel={t("grades")} state={productState.grade} />
          </VerdictRow>
        </dl>

        <p className="mt-4 text-muted text-sm">
          {t("source")}:{" "}
          <a
            className="font-medium text-link underline-offset-2 hover:underline"
            href={sources.baseuri}
            rel="noopener noreferrer"
            target="_blank"
          >
            {sources.api}
          </a>{" "}
          <button
            aria-label={t("licenses")}
            className="fluid-hover inline-flex size-7 items-center justify-center rounded-md align-middle text-muted hover:bg-surface-2 hover:text-ink"
            onClick={handleLicenseOpen}
            type="button"
          >
            <CircleHelp aria-hidden="true" className="size-4" />
          </button>
        </p>

        <Dialog
          onOpenChange={setLicenseOpen}
          open={licenseOpen}
          title={t("licenses")}
        >
          <LicenseModalContent />
        </Dialog>

        <ShareButton barcode={barcode} productName={productname} />
      </div>
    </section>
  );
}
