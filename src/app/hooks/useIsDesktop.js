"use client";

import { useEffect, useState } from "react";

const QUERY = "(min-width: 1024px) and (pointer: fine)";

export function useIsDesktop(){
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(()=>{
        const mql = window.matchMedia(QUERY);
        const update = () => setIsDesktop(mql.matches)

        update()
        mql.addEventListener("change", update)
        return () => mql.removeEventListener("change", update)
    }, [])

    return isDesktop
}