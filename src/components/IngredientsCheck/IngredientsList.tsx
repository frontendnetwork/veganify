import type { IconClassType } from "./models/Tooltip";
import type { TranslationFunction } from "./models/TranslateFunction";
import { TooltipClient } from "./shared/Tooltip";

interface IngredientListProps {
  iconClass: IconClassType;
  items: string[];
  t: TranslationFunction;
}

export function IngredientList({ items, iconClass, t }: IngredientListProps) {
  const tooltipMessages = {
    "maybe-vegan": t("maybe_vegan"),
    "unknown-vegan": t("unknown_vegan"),
  } as const;

  const shouldShowTooltip =
    iconClass.includes("maybe-vegan") || iconClass.includes("unknown-vegan");
  const tooltipBaseClass = iconClass.split(
    " "
  )[0] as keyof typeof tooltipMessages;
  const tooltipMessage = shouldShowTooltip
    ? tooltipMessages[tooltipBaseClass]
    : "";

  return (
    <>
      {items.map((item) => (
        <TooltipClient key={item} message={tooltipMessage as string}>
          <div className="Grid">
            <div className="Grid-cell description">
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </div>
            <div className="Grid-cell icons">
              <span className={iconClass} />
            </div>
          </div>
        </TooltipClient>
      ))}
    </>
  );
}
