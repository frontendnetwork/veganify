"use client";

import { useTranslations } from "next-intl";
import { type ChangeEvent, useCallback, useState } from "react";

import { GitHubIcon, KoFiIcon, PayPalIcon } from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils";

const SUPPORT_OPTIONS = {
  GITHUB: {
    icon: GitHubIcon,
    link: "https://github.com/sponsors/philipbrembeck",
    price: "1–100$",
    text: "Sponsor on GitHub",
    translationKey: "monthlyviagithub",
    vendor: "GitHub",
  },
  KOFI: {
    icon: KoFiIcon,
    link: "https://ko-fi.com/veganify",
    price: "1–50€",
    text: "Sponsor on Ko-Fi",
    translationKey: "onceviakofi",
    vendor: "Ko-Fi.com",
  },
  PAYPAL: {
    icon: PayPalIcon,
    link: "https://www.paypal.com/donate/?hosted_button_id=J7TEA8GBPN536",
    price: "1–15€",
    text: "Donate with PayPal",
    translationKey: "onceviapaypal",
    vendor: "PayPal",
  },
} as const;

const SupportOption = () => {
  const t = useTranslations("More");
  const [selected, setSelectedOption] = useState<
    (typeof SUPPORT_OPTIONS)[keyof typeof SUPPORT_OPTIONS]
  >(SUPPORT_OPTIONS.PAYPAL);
  const SelectedIcon = selected.icon;

  const handleOptionChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const option = Object.values(SUPPORT_OPTIONS).find(
        (o) => o.vendor === event.currentTarget.value
      );
      if (option) {
        setSelectedOption(option);
      }
    },
    []
  );

  return (
    <div role="radiogroup" aria-label={t("buyusacoffee")}>
      {Object.values(SUPPORT_OPTIONS).map((option) => {
        const Icon = option.icon;
        const isSelected = selected === option;
        return (
          <label
            className={cn(
              "fluid-hover mb-2 flex cursor-pointer items-center gap-3 rounded-xl border p-4",
              isSelected
                ? "border-accent bg-surface-2"
                : "border-line bg-surface hover:bg-surface-2"
            )}
            key={option.vendor}
          >
            <input
              checked={isSelected}
              className="size-4 accent-[var(--accent)]"
              name="support-option"
              onChange={handleOptionChange}
              type="radio"
              value={option.vendor}
            />
            <Icon aria-hidden="true" className="size-5 text-muted" />
            <span className="flex-1">
              <span className="block font-medium text-ink text-sm">
                {t(option.translationKey)}
              </span>
              <span className="block text-muted text-xs">
                {option.vendor} · {option.price}
              </span>
            </span>
          </label>
        );
      })}
      <div className="mt-4">
        <a
          className="fluid-hover flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent font-medium text-accent-foreground text-sm shadow-elev-1 hover:bg-accent-hover motion-safe:transition-transform motion-safe:active:scale-[0.96]"
          href={selected.link}
          rel="noopener noreferrer"
          target="_blank"
        >
          <SelectedIcon aria-hidden="true" className="size-4" />
          {selected.text}
        </a>
        <p className="mt-2 text-center text-muted text-xs">
          {t("redirect")} {selected.vendor}.
        </p>
      </div>
    </div>
  );
};

export default SupportOption;
