"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

import { cn } from "@/lib/utils";

const BackButton = ({ className }: { className?: string }) => {
  const t = useTranslations("Layout");
  const router = useRouter();
  const handleBack = useCallback(() => router.back(), [router]);

  return (
    <button
      aria-label={t("back")}
      className={cn(
        "fluid-hover flex size-11 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink",
        className
      )}
      onClick={handleBack}
      type="button"
    >
      <ArrowLeft aria-hidden="true" className="size-5" />
    </button>
  );
};

export default BackButton;
