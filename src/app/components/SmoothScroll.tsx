"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useIsDesktop } from "../hooks/useIsDesktop";

const SmoothScroll = ({ children}: {children: React.ReactNode})=>{
    const isDesktop = useIsDesktop();
    const rafId =  useRef<number | null>(null);

    useEffect(()=>{
        if(!isDesktop) return;

        if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
            return;
        }

        let lenis: Lenis | null = null;
        let cancelled = false;

        import("lenis").then(({default: LenisConstructor})=>{
            if(cancelled) return;

            lenis = new LenisConstructor();

            const raf = (time: number)=>{
                lenis?.raf(time);
                rafId.current = requestAnimationFrame(raf);
            }

            rafId.current = requestAnimationFrame(raf)
        })

        return ()=>{
            cancelled =  true;
            if(rafId.current !== null){
                cancelAnimationFrame(rafId.current)
            }
            lenis?.destroy();
        }
    },[isDesktop])

    return <>{children}</>
}

export default SmoothScroll