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
      className="fluid-hover max-w-full truncate rounded-full border border-line bg-surface-2 px-3 py-1.5 text-ink text-sm hover:border-line-strong"
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
    <div className="mt-6 border-line border-t pt-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-medium text-muted text-sm">{t("recent")}</p>
        <button
          className="fluid-hover text-muted text-xs underline-offset-2 hover:text-ink hover:underline"
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
