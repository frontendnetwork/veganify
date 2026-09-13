"use client";

import { CircleAlert, CircleHelp, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentType, SVGProps } from "react";

interface StatusMessagesProps {
  status: "notfound" | "invalid" | "timeout" | "error";
}

function StatusCard({
  icon: Icon,
  title,
  tone,
  children,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  tone: "neutral" | "danger" | "caution";
  children?: React.ReactNode;
}) {
  const tones = {
    caution: "text-caution",
    danger: "text-danger",
    neutral: "text-muted",
  } as const;

  return (
    <div className="mt-6 rounded-xl border border-line bg-surface p-5 shadow-elev-1">
      <div className="flex items-start gap-3">
        <Icon
          aria-hidden="true"
          className={`mt-0.5 size-5 shrink-0 ${tones[tone]}`}
        />
        <div className="min-w-0">
          <p className="font-medium text-ink">{title}</p>
          {children ? (
            <div className="mt-1 text-muted text-sm">{children}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function StatusMessages({ status }: StatusMessagesProps) {
  const t = useTranslations("Check");

  if (status === "notfound") {
    return (
      <StatusCard icon={CircleHelp} title={t("notindb")} tone="neutral">
        <p>{t("notindb_add")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            className="fluid-hover rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground text-sm hover:bg-accent-hover"
            href="https://world.openfoodfacts.org/cgi/product.pl"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("add_food")}
          </a>
          <a
            className="fluid-hover rounded-lg border border-line-strong bg-surface px-4 py-2 font-medium text-ink text-sm hover:bg-surface-2"
            href="https://world.openbeautyfacts.org/cgi/product.pl"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("add_cosmetic")}
          </a>
        </div>
      </StatusCard>
    );
  }

  if (status === "invalid") {
    return (
      <StatusCard icon={CircleAlert} title={t("wrongbarcode")} tone="caution">
        <p>{t("wrongbarcode_desc")}</p>
      </StatusCard>
    );
  }

  if (status === "timeout") {
    return <StatusCard icon={Clock} title={t("timeout2")} tone="neutral" />;
  }

  return (
    <StatusCard icon={CircleAlert} title={t("unknown_error")} tone="danger">
      <p>{t("checkconnection")}</p>
    </StatusCard>
  );
}
