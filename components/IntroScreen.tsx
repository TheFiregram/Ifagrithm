"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type IntroStage = "pending" | "opening" | "revealing" | "ready";

export default function IntroScreen({ onStageChange }: { onStageChange: (stage: IntroStage) => void }) {
  const cover = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const [phase, setPhase] = useState("waiting");
  const [circular, setCircular] = useState(true);

  useEffect(() => {
    const el = cover.current;
    const picture = image.current;
    if (!el || !picture) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let active = true, started = false, entered = false, finished = false;

    function finish() {
      if (!active || finished) return;
      finished = true;
      onStageChange("ready");
    }
    function exit() {
      if (!active || finished) return;
      setPhase("exiting");
      onStageChange("revealing");
    }
    function start() {
      if (!active || started || finished) return;
      started = true;
      clearTimeout(loadLimit);
      if (reduced.matches) { finish(); return; }
      setPhase("entering");
      onStageChange("opening");
      // A missing animation event must never leave the page covered.
      timers.push(setTimeout(finish, 3500));
    }
    function animationEnded(event: AnimationEvent) {
      if (!active || finished) return;
      if (event.animationName === "intro-picture-in" && !entered) {
        entered = true;
        setPhase("holding");
        timers.push(setTimeout(exit, 1500));
      }
      if (event.target === el && (event.animationName === "intro-circle-out" || event.animationName === "intro-fade-out")) finish();
    }
    const preferenceChanged = () => { if (reduced.matches) finish(); };
    const loadLimit = setTimeout(finish, 5000);
    root.style.overflow = "hidden";
    setCircular("registerProperty" in CSS);
    el.addEventListener("animationend", animationEnded);
    reduced.addEventListener("change", preferenceChanged);
    if (reduced.matches) finish();
    else picture.decode().then(start).catch(finish);

    return () => {
      active = false;
      clearTimeout(loadLimit);
      timers.forEach(clearTimeout);
      el.removeEventListener("animationend", animationEnded);
      reduced.removeEventListener("change", preferenceChanged);
      root.style.overflow = previousOverflow;
    };
  }, [onStageChange]);

  return <>
    <div ref={cover} className={`intro-screen phase-${phase}`} data-circular={circular} role="status" aria-label="IFAGRITHM">
      <div className="intro-art"><Image ref={image} src="/assets/intro-brand.jpg" alt="IFAGRITHM" width={1280} height={1280} priority /></div>
    </div>
    <noscript><style>{`.intro-screen{display:none!important}.site-content .hero *,.site-content .header-inner,.site-content .reveal{animation:none!important;opacity:1!important;transform:none!important;filter:none!important}`}</style></noscript>
  </>;
}
