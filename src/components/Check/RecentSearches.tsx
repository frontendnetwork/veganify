"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import {
  clearRecentChecks,
  loadRecentChecks,
  type RecentCheck,
} from "./recentChecks";

function RecentChip({
  entry,
  onSelect,
}: {
  entry: RecentCheck;
  onSelect: (ean: string) => void;
}) {
  const handleClick = useCallback(
    () => onSelect(entry.ean),
    [onSelect, entry.ean]
  );

  return (
    <button
      className="fluid-hover border-line bg-surface-2 text-ink hover:border-line-strong max-w-full truncate rounded-full border px-3 py-1.5 text-sm"
      onClick={handleClick}
      title={entry.ean}
      type="button"
    >
      {entry.name === "n/a" ? entry.ean : entry.name}
    </button>
  );
}

export function RecentSearches({
  onSelect,
}: {
  onSelect: (ean: string) => void;
}) {
  const t = useTranslations("Check");
  const [recents, setRecents] = useState<RecentCheck[]>([]);

  useEffect(() => {
    setRecents(loadRecentChecks());
  }, []);

  const clearRecents = useCallback(() => {
    clearRecentChecks();
    setRecents([]);
  }, []);

  if (recents.length === 0) {
    return null;
  }

  return (
    <div className="border-line mt-6 border-t pt-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-muted text-sm font-medium">{t("recent")}</h2>
        <button
          className="fluid-hover text-muted hover:text-ink text-xs underline-offset-2 hover:underline"
          onClick={clearRecents}
          type="button"
        >
          {t("clearrecent")}
        </button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {recents.map((entry) => (
          <li key={entry.ean}>
            <RecentChip entry={entry} onSelect={onSelect} />
          </li>
        ))}
      </ul>
    </div>
  );
}
