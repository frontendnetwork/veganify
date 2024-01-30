import Image from "next/image";
import Link from "next/link";

import BackButton from '@/components/button_back'

interface ContainerProps {
  heading?: string;
  headingstyle?: string;
  backbutton?: boolean;
  logo?: boolean;
  children: React.ReactNode;
}

export default function Container(props: Readonly<ContainerProps>) {
  const hasHeading = props.heading ? "true" : "false";
  const headingStyle = props.headingstyle ?? undefined;


  const hasBackButton = props.backbutton !== false ? true : false;
  const hasLogo = props.logo !== false ? true : false;

  return (
    <div className="container top">
      <div id="main">
        <div className="form component">
          {hasBackButton === true && <BackButton />}
          {hasLogo === true && (
            <>
              <Link href="/">
                <Image src="/./img/Veganify.svg" alt="Logo" className="logo" width={48} height={48} />
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
