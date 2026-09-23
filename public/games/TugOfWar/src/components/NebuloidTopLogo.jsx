import React from "react";
import nebuloidLogo from "../assets/nebuloid-logo.png";

export default function NebuloidTopLogo({ className = "" }) {
  return (
    <header className={`nebuloid-top-banner ${className}`}>
      <div className="nebuloid-logo-badge" title="Nebuloid Tech Studio">
        <img
          src={nebuloidLogo}
          alt="Nebuloid Tech Studio"
          className="nebuloid-top-logo-img"
        />
      </div>
    </header>
  );
}
