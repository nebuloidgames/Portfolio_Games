import React from "react";
import nebuloidLogo from "../assets/nebuloid-logo.png";

export default function TopLogoBanner() {
  return (
    <div className="w-full h-20 sm:h-24 md:h-28 flex items-center justify-center shrink-0 z-30 px-4">
      <img
        src={nebuloidLogo}
        alt="Nebuloid Logo"
        className="h-[74px] w-auto object-contain select-none block"
      />
    </div>
  );
}

