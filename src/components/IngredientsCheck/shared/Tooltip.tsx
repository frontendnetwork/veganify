"use client";

import { useState } from "react";

interface TooltipProps {
  message: string;
  children: React.ReactNode;
}

export function TooltipClient({ message, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  if (!message) {
    return children;
  }

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="tooltip">
          {message}
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </div>
  );
}
