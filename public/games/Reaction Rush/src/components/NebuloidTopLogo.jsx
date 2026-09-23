import React from "react";
import nebuloidLogo from "../assets/nebuloid-logo.png";

export default function NebuloidTopLogo() {
  return (
    <div className="relative z-40 w-full flex justify-center items-center pt-3 pb-1 no-print">
      <div className="relative h-[48px] px-6 backdrop-blur-md flex items-center justify-center transition-all">
        <img
          src={nebuloidLogo}
          alt="Nebuloid Logo"
          className="h-[60px] mt-5 w-auto object-contain select-none pointer-events-none"
        />
      </div>
    </div>
  );
}
