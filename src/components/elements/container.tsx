import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BackButton from '@/components/button_back'

interface ContainerProps {
  heading?: string;
  headingstyle?: string;
  backbutton?: boolean;
  logo?: boolean;
  children: React.ReactNode;
}

export default function Container(props: ContainerProps) {
  let hasHeading = props.heading ? "true" : "false";
  let headingStyle = props.headingstyle || undefined;

  let hasBackButton = props.backbutton !== false ? true : false;
  let hasLogo = props.logo !== false ? true : false;

  return (
    <div className="container top">
      <div id="main">
        <div className="form component">
          {hasBackButton === true && <BackButton />}
          {hasLogo === true && (
            <>
              <Link href="/">
                <Image src="/./img/VeganCheck.svg" alt="Logo" className="logo" width={48} height={48} />
              </Link>
              <br />
            </>
          )}
          {hasHeading === "true" && (
            <h2 style={headingStyle === "center" ? { textAlign: "center" } : {}}>{props.heading}</h2>
          )}
          {props.children}
        </div>
      </div>
    </div>
  );
}
