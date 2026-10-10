"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import IntroScreen, { type IntroStage } from "./IntroScreen";
import HeroSignals from "./HeroSignals";
import RotatingHeadline from "./RotatingHeadline";
import FeatureSection from "./FeatureSection";
import { Arrow, BrandMark } from "./Brand";
import { BriefWall } from "./ResearchVisuals";
import GlyphFooter from "./GlyphFooter";
import { useTheme } from "./ThemeProvider";
import EnquiryForm from "./EnquiryForm";
import WhoWeHelp from "./WhoWeHelp";
import { companyDescriptor, companyIntroduction, companyWork, companyExpansion, heroCopy, stages, questions } from "../lib/site-content";

const EMAIL="Ifagrithm@gmail.com";
const X_URL="https://x.com/ifagrithm?s=11";
const LINKEDIN_URL="https://www.linkedin.com/company/ifagrithm/";
const links=[{label:"Home",href:"#top"},{label:"Capabilities",href:"#services"},{label:"How We Work",href:"#approach"},{label:"Who We Help",href:"#who-we-help"},{label:"FAQs",href:"#faq"},{label:"Join the network",href:"/application"}];

function Brand({ footer=false }: {footer?:boolean}) {
  return <a className={`brand${footer?" footer-brand":" corner-brand"}`} href="#top" aria-label="IFAGRITHM home"><span className="brand-turn"><BrandMark priority={!footer}/></span><span className="brand-name">IFAGRITHM</span></a>;
}

function Odometer({ value, delay=0 }: {value:string;delay?:number}) {
  return <span className="odometer" aria-label={String(Number(value))} style={{"--count-delay":`${delay}s`} as CSSProperties}>{[...value].map((digit,index)=><span className="digit-window" key={index} aria-hidden="true"><span className="digit-track" style={{"--end":20+Number(digit),"--digit-delay":`${index*.12}s`} as CSSProperties}>{Array.from({length:30},(_,number)=><span key={number}>{number%10}</span>)}</span></span>)}</span>;
}

function PixelHeart() {
  const shape=[".XX.XX.","XXXXXXX","XXXXXXX",".XXXXX.","..XXX..","...X..."];
  return <div className="pixel-heart" aria-hidden="true">{shape.flatMap((row,y)=>[...row].map((pixel,x)=>pixel==="X"?<i key={`${x}-${y}`} style={{"--pixel":x+y*2,gridColumn:x+1,gridRow:y+1} as CSSProperties}/>:null))}</div>;
}

export default function Site() {
  const [introStage,setIntroStage]=useState<IntroStage>("pending");
  const [menu,setMenu]=useState(false);
  const {theme,toggleTheme}=useTheme();
  const [openQuestion,setOpenQuestion]=useState<number|null>(null);
  const menuButton=useRef<HTMLButtonElement>(null);
  const header=useRef<HTMLElement>(null);
  const content=useRef<HTMLDivElement>(null);
  const progress=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      const el=entry.target as HTMLElement;
      if(entry.isIntersecting)el.dataset.visible="true";
      else if(entry.boundingClientRect.bottom<0||entry.boundingClientRect.top>window.innerHeight)el.dataset.visible="false";
    }),{threshold:.08});
    document.querySelectorAll("[data-reveal-section]").forEach(el=>observer.observe(el));
    let frame=0;
    let previousY=Math.max(0,window.scrollY),travel=0;
    const update=()=>{
      frame=0;
      const y=Math.max(0,window.scrollY),vh=window.innerHeight,maximum=document.documentElement.scrollHeight-vh;
      const exit=reduced.matches?0:1-Math.pow(1-Math.min(1,y/(.6*vh)),3);
      content.current?.style.setProperty("--hero-exit",String(exit));
      if(progress.current)progress.current.style.transform=`scaleX(${maximum>0?y/maximum:0})`;
      if(header.current){
        header.current.dataset.scrolled=String(y>40);
        const delta=y-previousY;
        if(y<=40){travel=0;header.current.dataset.compact="false";}
        else if(delta!==0){
          travel=Math.sign(delta)===Math.sign(travel)?travel+delta:delta;
          if(Math.abs(travel)>=12)header.current.dataset.compact=String(travel>0);
        }
      }
      previousY=y;
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule);reduced.addEventListener("change",schedule);update();
    return()=>{observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);reduced.removeEventListener("change",schedule);};
  },[]);

  useEffect(()=>{
    if(!menu)return;
    const el=header.current;if(!el)return;
    const root=document.documentElement,previous=root.style.overflow;root.style.overflow="hidden";
    el.querySelector<HTMLAnchorElement>("nav a")?.focus();
    const escape=(event:KeyboardEvent)=>{
      if(event.key==="Escape"){setMenu(false);menuButton.current?.focus();}
      if(event.key==="Tab"){
        const items=Array.from(el.querySelectorAll<HTMLElement>("a,button")).filter(item=>item.getBoundingClientRect().width>0);
        const first=items[0],last=items[items.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
      }
    };
    window.addEventListener("keydown",escape);
    return()=>{root.style.overflow=previous;window.removeEventListener("keydown",escape);};
  },[menu]);

  const introBlocks=introStage==="opening"||introStage==="revealing";

  return <>
    {introStage!=="ready"?<IntroScreen onStageChange={setIntroStage}/>:null}
    <div className="site-content" data-intro={introStage} ref={content} inert={introBlocks} aria-hidden={introBlocks}>
      <a className="skip-link" href="#main">Skip to content</a><div className="reading-progress" ref={progress} aria-hidden="true"/>
      <header className="site-header" ref={header} data-menu-open={menu}><div className="header-inner"><Brand/><nav id="primary-navigation" className={`navigation${menu?" is-open":""}`} aria-label="Main navigation">{links.map(link=><a key={link.href} href={link.href} onClick={()=>setMenu(false)}>{link.label}</a>)}</nav><div className="header-actions"><a className="button demo-cta header-cta" href="#contact" onClick={()=>setMenu(false)}>Discuss a Project <Arrow/></a><button className="theme-button" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme==="dark"?"light":"dark"} mode`} title={`Switch to ${theme==="dark"?"light":"dark"} mode`}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M12 5a7 7 0 0 1 0 14Z" fill="currentColor"/></svg></button><button className="menu-button" ref={menuButton} type="button" onClick={()=>setMenu(current=>!current)} aria-label={menu?"Close menu":"Open menu"} aria-expanded={menu} aria-controls="primary-navigation"><span/><span/></button></div></div></header>
      {menu?<div className="menu-scrim" onClick={()=>setMenu(false)} aria-hidden="true"/>:null}
      <main id="main">
        <section className="hero" id="top" aria-label="IFAGRITHM Web3 Research and Business Services"><HeroSignals/><div className="hero-content"><div className="hero-mark-motion"><div className="hero-mark hero-enter"><BrandMark priority/><span className="hero-logo-scan"/></div></div><div className="hero-copyblock"><span className="eyebrow hero-category hero-enter">{companyDescriptor}</span><RotatingHeadline running={introStage==="revealing"||introStage==="ready"}/><p className="hero-copy hero-enter">{heroCopy}</p><div className="hero-actions hero-enter"><a className="button demo-cta" href="#contact">Discuss a Project <Arrow/></a><a className="button button-outline" href="#services">Explore Capabilities <Arrow/></a></div></div></div><a className="scroll-cue hero-enter" href="#services" aria-label="Explore our capabilities"><span>Scroll to explore</span><i><span/></i></a></section>
        <FeatureSection/>
        <section className="method-scroll" id="approach" aria-labelledby="approach-title"><span className="anchor-alias" id="method"/><div className="method-sticky shell" data-reveal-section><div className="method-grid"><div className="method-copy"><h2 className="section-heading enter-item" id="approach-title">Start with the<br/>business question.</h2><p className="enter-item">Understand → Define → Deliver → Review</p><div className="method-note enter-item">A defined engagement, agreed before work begins. <strong>Scope, responsibilities and commercial terms come first.</strong></div><a className="button demo-cta enter-item" href="#contact">Discuss a Project <Arrow/></a></div><div className="method-network"><div className="method-line"><i/></div>{stages.map((stage,index)=><div className={`method-row method-row-${index}`} key={stage.label} style={{"--stage":index} as CSSProperties}><span className="method-node"/><div className="method-row-copy"><div className="method-avatars" aria-hidden="true">{stage.nodes.map((node,nodeIndex)=><span className={`method-avatar avatar-tone-${nodeIndex%4}`} key={nodeIndex} style={{"--avatar":nodeIndex} as CSSProperties}>{node}</span>)}</div><span className="method-stage-label">{stage.title}</span><p>{stage.text}</p></div><span className="method-number">0{index+1}<span>{stage.label}</span></span></div>)}</div></div></div></section>
        <section className="focus-scroll" id="focus" aria-labelledby="focus-title"><div className="focus-sticky" data-reveal-section><HeroSignals/><div className="focus-inner"><p className="focus-eyebrow enter-item">Every engagement starts with</p><span className="focus-caption enter-item">RESEARCH. INTELLIGENCE. SPECIALIST BUSINESS SUPPORT.</span><h2 id="focus-title" className="focus-number enter-item"><Odometer value="01" delay={.42}/><span>question.</span></h2><div className="focus-stats"><div className="focus-stat enter-item"><Odometer value="4" delay={1.4}/><span>capability areas</span></div><i/><div className="focus-stat enter-item"><Odometer value="4" delay={1.56}/><span>process stages</span></div><i/><div className="focus-stat enter-item"><Odometer value="1" delay={1.72}/><span>defined scope</span></div></div></div></div></section>
        <section className="about-section" aria-labelledby="about-title"><div className="shell about-grid" id="about" data-reveal-section><div className="enter-item"><span className="eyebrow">About IFAGRITHM</span><h2 className="section-heading" id="about-title">One company.<br/>Multiple capabilities.</h2></div><div className="about-copy enter-item"><p>{companyIntroduction}</p><p>{heroCopy}</p><p>{companyWork}</p><p>{companyExpansion}</p><blockquote>Solutions shaped around real business needs.</blockquote><a className="button demo-cta" href="#contact">Discuss a Project <Arrow/></a></div></div></section>
        <WhoWeHelp/>
        <section className="faq-scroll" id="faq" aria-labelledby="faq-title"><div className="faq-sticky shell" data-reveal-section><div className="faq-heading enter-item"><h2 className="section-heading" id="faq-title">Questions, answered</h2><p>Have a different question? <a href={`mailto:${EMAIL}`}>Talk to us <Arrow/></a></p></div><div className="faq-list">{questions.map((item,index)=><article className={`faq-row${openQuestion===index?" is-open":""}`} key={item.question} style={{"--row":index} as CSSProperties}><h3><button type="button" className="faq-toggle" aria-expanded={openQuestion===index} aria-controls={`faq-answer-${index}`} onClick={()=>setOpenQuestion(current=>current===index?null:index)}><span className="faq-index">0{index+1}</span><span>{item.question}</span><span className="faq-plus" aria-hidden="true"><i/><i/></span></button></h3><div className="faq-answer" id={`faq-answer-${index}`} inert={openQuestion!==index} aria-hidden={openQuestion!==index}><div><p>{item.answer}</p></div></div></article>)}</div></div></section>
        <section className="outro-scroll" aria-labelledby="outro-title"><div className="outro-sticky" data-reveal-section><BriefWall backdrop/><div className="outro-content"><PixelHeart/><h2 className="section-heading enter-item" id="outro-title">Make your next decision<br/>with evidence.</h2><p className="enter-item">Research. Intelligence. Specialist business support.<br/>Start with a defined business need.</p><a className="button demo-cta enter-item" href="#contact">Discuss a Project <Arrow/></a></div></div></section>
        <section className="contact-section shell" id="contact" aria-labelledby="contact-title" data-reveal-section><div className="contact-grid"><div className="contact-copy enter-item"><span className="eyebrow">Discuss a Project</span><h2 className="section-heading" id="contact-title">Tell us what you’re working on.</h2><p>Share your product, your current challenge and the outcome you want. We’ll review the fit and discuss a practical scope.</p><p className="contact-scope-note">Research and analytics are our core. Growth, partnership and custom assignments depend on scope and delivery capacity.</p></div><EnquiryForm/></div></section>
      </main>
      <footer className="site-footer"><div className="shell"><div className="footer-top"><Brand footer/><nav aria-label="Footer navigation">{links.filter(link=>link.href!=="#focus").map(link=><a href={link.href} key={link.href}>{link.label}</a>)}<a href={`mailto:${EMAIL}`}>{EMAIL} <Arrow/></a><a href={X_URL} target="_blank" rel="noopener noreferrer">X / @ifagrithm <Arrow/></a><a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn <Arrow/></a></nav><a className="back-to-top" href="#top">Back to top <Arrow direction="up"/></a></div><div className="footer-meta"><span>© 2026 IFAGRITHM</span><span>{companyDescriptor}</span><span>Research. Intelligence. Specialist business support.</span></div></div><GlyphFooter/></footer>
    </div>
  </>;
}
