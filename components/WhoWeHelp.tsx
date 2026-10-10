"use client";

import { useEffect, useRef, useState } from "react";
import { SignalGraph } from "./ResearchVisuals";
import { sectors } from "../lib/site-content";

export default function WhoWeHelp() {
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <section className="sectors-section" id="who-we-help" ref={section} aria-labelledby="sectors-title" data-reveal-section>
    <div className="shell">
      <div className="sectors-intro">
        <div className="enter-item"><span className="eyebrow">Who We Help</span><h2 className="section-heading" id="sectors-title">Built for teams<br/>working across Web3.</h2><p>We primarily engage founders and teams building products and services in Web3. The right engagement depends on the business question and our ability to deliver, rather than the category alone.</p></div>
        <div className="sectors-visual enter-item" aria-hidden="true"><SignalGraph active={visible}/></div>
      </div>
      <div className="sector-grid">{sectors.map((sector, index) => <article className="sector-card enter-item" key={sector.title} style={{ transitionDelay: `${index * .08}s` }}><span className="eyebrow">0{index + 1}</span><h3>{sector.title}</h3><p>{sector.copy}</p></article>)}</div>
    </div>
  </section>;
}
