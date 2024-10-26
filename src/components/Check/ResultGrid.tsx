import { ReactNode } from "react";

interface ResultGridProps {
  label: string;
  iconClass: string;
  helpModal?: ReactNode;
}

export function ResultGrid({ label, iconClass, helpModal }: ResultGridProps) {
  return (
    <div className="Grid">
      <div className="Grid-cell description">
        {label}
        {helpModal}
      </div>
      <div className="Grid-cell icons">
        <span className={iconClass}></span>
      </div>
    </div>
  );
}
