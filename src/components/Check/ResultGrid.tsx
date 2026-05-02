import type { ReactNode } from "react";

interface ResultGridProps {
  helpModal?: ReactNode;
  iconClass: string;
  label: string;
}

export function ResultGrid({ label, iconClass, helpModal }: ResultGridProps) {
  return (
    <div className="Grid">
      <div className="Grid-cell description">
        {label}
        {helpModal}
      </div>
      <div className="Grid-cell icons">
        <span className={iconClass} />
      </div>
    </div>
  );
}
