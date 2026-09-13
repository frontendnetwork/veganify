"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

const BackButton = () => {
  const router = useRouter();
  const handleBack = useCallback(() => router.back(), [router]);
  return (
    <span
      className="icon-left-open back"
      onClick={handleBack}
      style={{ cursor: "pointer" }}
    />
  );
};

export default BackButton;
