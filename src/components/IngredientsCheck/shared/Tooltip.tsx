"use client";

import { useCallback, useState } from "react";

interface TooltipProps {
  children: React.ReactNode;
  message: string;
}

export function TooltipClient({ message, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = useCallback(() => setIsVisible(true), []);
  const hideTooltip = useCallback(() => setIsVisible(false), []);

  if (!message) {
    return children;
  }

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {!!isVisible && (
        <div className="tooltip">
          {message}
          <div className="tooltip-arrow" />
        </div>
      )}
    </div>
  );
}
