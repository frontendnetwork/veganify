import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

import BackButton from "@/components/button_back";

interface ContainerProps {
  heading?: string;
  headingStyle?: "center" | string;
  backButton?: boolean;
  logo?: boolean;
  children: ReactNode;
}

export default function Container({
  heading,
  headingStyle,
  backButton = true,
  logo = true,
  children,
}: Readonly<ContainerProps>) {
  return (
    <div className="container top">
      <div id="main">
        <div className="form component">
          {backButton && <BackButton />}
          {logo && (
            <>
              <Link href="/">
                <Image
                  src="/./img/Veganify.svg"
                  alt="Logo"
                  className="logo"
                  width={48}
                  height={48}
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
