"use client";

import Image from "next/image";
import LogoBackdrop from "./LogoBackdrop";
import { type FormEvent, useEffect, useRef, useState } from "react";

const EMAIL = "Ifagrithm@gmail.com";
const X_URL = "https://x.com/ifagrithm?s=11";
const LINKEDIN_URL = "https://www.linkedin.com/company/ifagrithm/";
const services = [
  { title: "User & Behaviour", suffix: "Research", description: "Understand how people use your product, what different user groups do, and how activity changes over time.", outputs: ["Behaviour segments", "User journey analysis", "Retention and activity research"] },
  { title: "Market & Competitor", suffix: "Intelligence", description: "Investigate competing products, market activity and the alternatives your users already choose.", outputs: ["Competitor studies", "Market briefs", "Product comparisons"] },
  { title: "Growth & Distribution", suffix: "Research", description: "Investigate where relevant audiences already are and assess channels, communities and partnerships worth testing.", outputs: ["Audience research", "Distribution maps", "Partnership assessments"] },
  { title: "Decision Research", suffix: "& Measurement", description: "Combine evidence around a business question, then measure what happens when a team acts on it.", outputs: ["Decision briefs", "Intervention analysis", "Custom analytical studies"] },
];
const steps = [
  { title: "Define the decision", text: "Agree on the question, the scope and what the research needs to inform.", label: "DEFINE" },
  { title: "Investigate the evidence", text: "Use on-chain activity, market information and qualitative research as the question requires.", label: "INVESTIGATE" },
  { title: "Deliver the findings", text: "Explain the patterns, limitations and practical options in a clear research brief.", label: "DELIVER" },
];

function Brand({ footer = false }: { footer?: boolean }) {
  return <a className={`brand${footer ? " footer-brand" : ""}`} href="#top" aria-label="IFAGRITHM home"><span className="brand-icon"><Image src={"/assets/brand-symbol-transparent.png"} alt="" width={70} height={70} priority /></span><span>IFAGRITHM</span></a>;
}

export default function Site() {
  const [menu, setMenu] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeService, setActiveService] = useState<number | null>(0);
  const [activeStep, setActiveStep] = useState(0);
  const [status, setStatus] = useState("");
  const [brief, setBrief] = useState({ name: "", email: "", company: "", question: "" });
  const menuButton = useRef<HTMLButtonElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const method = useRef<HTMLElement>(null);

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } }), { threshold: .12 });
    document.querySelectorAll<HTMLElement>(".reveal").forEach(el => observer.observe(el));
    let frame = 0;
    const update = () => {
      const y = window.scrollY, maximum = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${maximum > 0 ? y / maximum : 0})`;
      frame = 0;
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", scroll, { passive: true }); update();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", scroll); };
  }, []);
  useEffect(() => {
    if (!menu) return;
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenu(false); menuButton.current?.focus(); } };
    window.addEventListener("keydown", escape); return () => window.removeEventListener("keydown", escape);
  }, [menu]);

  useEffect(() => {
    const el = method.current;
    if (!el) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    function refresh() {
      if (timer) clearInterval(timer);
      timer = undefined;
      if (visible && !document.hidden && !media.matches) {
        timer = setInterval(() => {
          if (!el?.contains(document.activeElement)) setActiveStep(current => (current + 1) % steps.length);
        }, 6000);
      }
    }
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      refresh();
    }, { threshold: .2 });
    observer.observe(el);
    media.addEventListener("change", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
      media.removeEventListener("change", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  function briefText() { return `IFAGRITHM PROJECT ENQUIRY\n\nName: ${brief.name.trim()}\nWork email: ${brief.email.trim()}\nCompany: ${brief.company.trim() || "Not provided"}\n\nResearch question:\n${brief.question.trim()}`; }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!brief.name.trim() || !brief.email.trim() || !brief.question.trim()) { setStatus("Complete your name, work email, and research question."); return; }
    setStatus("Review and send your enquiry in your email app. You can contact us directly at Ifagrithm@gmail.com if it does not open.");
    window.location.assign(`mailto:${EMAIL}?subject=${encodeURIComponent(`IFAGRITHM project enquiry${brief.company.trim() ? `: ${brief.company.trim()}` : ""}`)}&body=${encodeURIComponent(briefText())}`);
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a><div className="reading-progress" ref={progress} aria-hidden="true" />
    <LogoBackdrop />
    <header className="site-header"><div className="shell header-inner"><Brand /><nav id="primary-navigation" className={`navigation${menu ? " open" : ""}`} aria-label="Main navigation"><a href="#services" onClick={() => setMenu(false)}>Services</a><a href="#approach" onClick={() => setMenu(false)}>Approach</a><a className="nav-cta" href="#contact" onClick={() => setMenu(false)}>Discuss a project <span className="button-orb" aria-hidden="true" /></a></nav><div className="header-actions"><button className="theme-button" type="button" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" /><path d="M12 5a7 7 0 0 1 0 14Z" fill="currentColor" /></svg></button><button ref={menuButton} className="menu-button" onClick={() => setMenu(m => !m)} type="button" aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu} aria-controls="primary-navigation"><span /><span /></button></div></div></header>
    <main id="main">
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="shell hero-inner">
          <div className="hero-content">
            <div className="hero-mark" aria-hidden="true"><Image src="/assets/brand-symbol-transparent.png" alt="" width={180} height={180} priority /></div>
            <h1 id="hero-title"><span>Understand your users.</span><span>Find where growth can come from.</span></h1>
            <p className="hero-copy">User behaviour, market research and competitor intelligence for clearer business decisions.</p>
            <div className="hero-actions"><a className="primary-button hero-primary" href="#contact">Discuss a project</a><a className="hero-secondary" href="#services">Our services</a></div>
          </div>
          <div className="hero-floor"><a className="scroll-cue" href="#services">SCROLL <span className="scroll-track" aria-hidden="true"><i /></span></a></div>
        </div>
      </section>
      <section className="services section" id="services" aria-labelledby="services-title"><div className="shell"><div className="section-topline reveal"><span className="section-number">01 / WHAT WE DO</span></div><div className="section-title-row reveal"><h2 id="services-title">Research built around<br /><em>your next decision.</em></h2></div><div className="service-list">{services.map((s, i) => <article className={`service-item${activeService === i ? " expanded" : ""}`} key={s.title}><button className="service-toggle" type="button" onClick={() => setActiveService(activeService === i ? null : i)} aria-expanded={activeService === i} aria-controls={`service-${i}`}><span className="service-index">0{i + 1}</span><h3>{s.title}<span>{s.suffix}</span></h3><span className="expand-symbol" aria-hidden="true">{activeService === i ? "−" : "+"}</span></button><div className="service-detail" id={`service-${i}`} inert={activeService !== i}><div className="service-detail-clip"><div className="service-detail-inner"><div className="service-description"><p>{s.description}</p><div className="service-outputs"><span className="output-label">TYPICAL OUTPUTS</span><ul>{s.outputs.map(o => <li key={o}>{o}</li>)}</ul></div></div></div></div></div></article>)}</div></div></section>
      <section className="method-scroll" id="approach" ref={method} aria-labelledby="approach-title"><span id="method" className="anchor-alias" /><span id="about" className="anchor-alias" /><div className="method-sticky reveal"><div className="shell"><div className="section-topline"><span className="section-number">02 / HOW WE WORK</span></div><div className="method-grid"><div className="method-heading"><h2 id="approach-title">A clear <em>question.</em></h2><p>Evidence you can inspect. A useful next step.</p><div className="step-controls" role="group" aria-label="Research stages">{steps.map((s, i) => <button type="button" key={s.label} className={activeStep === i ? "active" : ""} aria-pressed={activeStep === i} onClick={() => setActiveStep(i)}><span>0{i + 1}</span>{s.label}</button>)}</div></div><div className="method-visual"><div className="method-orbit" aria-hidden="true"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="orbit-ring ring-three" /><span className={`orbit-signal position-${activeStep}`} /><div className="orbit-logo"><Image src={"/assets/brand-symbol-transparent.png"} alt="" width={200} height={200} /></div></div><div className="method-card" key={activeStep}><span className="eyebrow">0{activeStep + 1} / {steps[activeStep].label}</span><h3>{steps[activeStep].title}</h3><p>{steps[activeStep].text}</p></div></div></div></div></div></section>
      <section className="contact section" id="contact" aria-labelledby="contact-title"><div className="shell"><div className="section-topline reveal"><span className="section-number">03 / START A PROJECT</span></div><div className="contact-grid"><div className="contact-copy reveal"><h2 id="contact-title">What are you trying<br />to <em>understand?</em></h2><p>Tell us about your product and the decision you are working through.</p><a className="email-link" href={`mailto:${EMAIL}`}>{EMAIL}</a><div className="social-links"><a href={X_URL} target="_blank" rel="noopener noreferrer">X / @ifagrithm</a><a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a></div></div><form className="brief-form reveal" onSubmit={submit}><div className="form-row"><label htmlFor="brief-name">Name<input id="brief-name" name="name" autoComplete="name" required maxLength={200} placeholder="Name" value={brief.name} onChange={e => setBrief({ ...brief, name: e.target.value })} /></label><label htmlFor="brief-email">Work email<input id="brief-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" value={brief.email} onChange={e => setBrief({ ...brief, email: e.target.value })} /></label></div><label htmlFor="brief-company">Company <span className="optional">(optional)</span><input id="brief-company" name="company" autoComplete="organization" maxLength={200} placeholder="Your team or product" value={brief.company} onChange={e => setBrief({ ...brief, company: e.target.value })} /></label><label htmlFor="brief-question">What would you like us to investigate?<textarea id="brief-question" name="question" required maxLength={4000} rows={3} placeholder="The decision, the challenge, or the question…" value={brief.question} onChange={e => setBrief({ ...brief, question: e.target.value })} /></label><div className="form-actions"><button className="primary-button" type="submit">Submit enquiry <span className="button-orb" aria-hidden="true" /></button></div><p className="form-helper">Your email app will open. Review and send your enquiry there.</p><p className="form-status" role="status">{status}</p></form></div></div></section>
    </main><footer className="site-footer"><div className="shell reveal"><div className="footer-top"><Brand footer /><a href="#top" className="back-to-top">Back to top <span className="top-mark" aria-hidden="true">↑</span></a></div><div className="footer-bottom"><span>© 2026 IFAGRITHM</span></div></div></footer>
  </>;
}
