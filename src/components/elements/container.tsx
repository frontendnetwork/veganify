import { useState, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/button_back";

interface ContainerProps {
  heading?: string;
  headingstyle?: string;
  backbutton?: string;
  logo?: string;
  children: ReactNode;
}

export default function Container(props: ContainerProps) {
  let hasHeading = false;
  let hasBackButton = true;
  let hasLogo = true;
  let headingStyle = {};

  if (props.heading) {
    hasHeading = true;
    if (props.headingstyle) {
      headingStyle = { textAlign: props.headingstyle };
    }
  }

  if (props.backbutton === "false") {
    hasBackButton = false;
  }

  if (props.logo === "false") {
    hasLogo = false;
  }

  return (
    <div className="container top">
      <div id="main">
        <div className="form component">
          {hasBackButton && <BackButton />}
          {hasLogo && (
            <>
              <Link href="/">
                <Image
                  src="/./img/VeganCheck.svg"
                  alt="Logo"
                  className="logo"
                  width={48}
                  height={48}
                />
              </Link>
              <br />
            </>
          )}
          {hasHeading && (
            <h2 style={headingStyle}>{props.heading}</h2>
          )}
          {props.children}
        </div>
      </div>
    </div>
  );
}
