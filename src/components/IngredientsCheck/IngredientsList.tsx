import { IconClassType } from "./models/Tooltip";
import { TranslationFunction } from "./models/TranslateFunction";
import { TooltipClient } from "./shared/Tooltip";

interface IngredientListProps {
  items: string[];
  iconClass: IconClassType;
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
        <TooltipClient message={tooltipMessage as string} key={item}>
          <div className="Grid">
            <div className="Grid-cell description">
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </div>
            <div className="Grid-cell icons">
              <span className={iconClass}></span>
            </div>
          </div>
        </TooltipClient>
      ))}
    </>
  );
}
