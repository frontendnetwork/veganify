import { CircleAlert, CircleCheck, CircleHelp, X } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import type { TranslationFunction } from "./models/TranslateFunction";

export type IconTone = "success" | "danger" | "caution" | "unknown";

const toneConfig: Record<
  IconTone,
  { icon: ComponentType<SVGProps<SVGSVGElement>>; className: string }
> = {
  caution: { className: "text-caution", icon: CircleAlert },
  danger: { className: "text-danger", icon: X },
  success: { className: "text-success", icon: CircleCheck },
  unknown: { className: "text-muted", icon: CircleHelp },
};

interface IngredientListProps {
  icon: IconTone;
  items: string[];
  t: TranslationFunction;
}

export function IngredientList({ items, icon, t }: IngredientListProps) {
  const tooltipMessages: Record<"caution" | "unknown", string> = {
    caution: t("maybe_vegan"),
    unknown: t("unknown_vegan"),
  };
  const shouldShowTooltip = icon === "caution" || icon === "unknown";

  return (
    <>
      {items.map((item) => (
        <Tooltip
          key={item}
          label={shouldShowTooltip ? tooltipMessages[icon] : ""}
        >
          <div className="flex items-center justify-between border-line border-b py-2.5 text-sm last:border-b-0">
            <span className="min-w-0 break-words pr-3 text-ink">
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </span>
            <StatusGlyph tone={icon} />
          </div>
        </Tooltip>
      ))}
    </>
  );
}

function StatusGlyph({ tone }: { tone: IconTone }) {
  const { icon: Icon, className } = toneConfig[tone];
  return (
    <span className={`inline-flex shrink-0 ${className}`}>
      <Icon aria-hidden="true" className="size-5" strokeWidth={2.5} />
    </span>
  );
}
