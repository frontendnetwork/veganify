"use client";

import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <span
      onClick={() => router.back()}
      style={{ cursor: "pointer" }}
      className="icon-left-open back"
    />
  );
};

export default BackButton;
