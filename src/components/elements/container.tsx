import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import BackButton from "@/components/button_back";

interface ContainerProps {
  backButton?: boolean;
  children: ReactNode;
  heading?: string;
  headingStyle?: "center" | { textAlign: string };
  logo?: boolean;
}

export default function Container({
  heading,
  headingStyle,
  backButton = true,
  logo = true,
  children,
}: Readonly<ContainerProps>) {
  return (
    <div className="top container">
      <div id="main">
        <div className="form component">
          {backButton && <BackButton />}
          {logo && (
            <>
              <Link href="/" prefetch={true}>
                <Image
                  alt="Logo"
                  className="logo"
                  height={48}
                  src="/./img/Veganify.svg"
                  width={48}
                />
              </Link>
              <br />
            </>
          )}
          {heading && (
            <h2
              style={headingStyle === "center" ? { textAlign: "center" } : {}}
            >
              {heading}
            </h2>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
