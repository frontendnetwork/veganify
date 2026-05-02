"use client";

import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <span
      className="icon-left-open back"
      onClick={() => router.back()}
      style={{ cursor: "pointer" }}
    />
  );
};

export default BackButton;
