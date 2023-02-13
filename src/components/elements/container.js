import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BackButton from  '@/components/button_back'

export default function Container(props) {
  if(props.heading){
    var hasHeading = "true";
    if (props.headingstyle) {
      var headingStyle = props.headingstyle;
    }
  }
  else {
    var hasHeading = "false";
  }
  if (props.backbutton === "false") {
    var hasBackButton = "false";
  } else {
    var hasBackButton = "true";
  }
  if (props.logo === "false") {
    var hasLogo = "false";
  } else {
    var hasLogo = "true";
  }

    return (
      <div className="container top">
        <div id="main">
          <div className="form component">
          {hasBackButton === "true" && (
            <BackButton />)}
            {hasLogo === "true" && (<><Link href="/"><Image src="/./img/VeganCheck.svg" alt="Logo" className="logo" width={48} height={48} /></Link><br /></>)}
            {hasHeading === "true" &&(
            <h2 style={ headingStyle === "center" ? {textAlign: "center"} : {} }>{props.heading}</h2>
            )}
            {props.children}
          </div>
        </div>
      </div>
    );
  }