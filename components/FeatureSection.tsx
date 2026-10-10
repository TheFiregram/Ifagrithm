"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Arrow } from "./Brand";
import { capabilities } from "../lib/site-content";
import { BriefWall, EvidenceRuler, MarketFlow, OrbitField } from "./ResearchVisuals";

const features = capabilities;

export default function FeatureSection() {
  const section=useRef<HTMLElement>(null);
  const buttons=useRef<(HTMLButtonElement|null)[]>([]);
  const [active,setActive]=useState(0);
  const [visible,setVisible]=useState(false);
  const compact=useRef(false);
  const activeRef=useRef(0);
  const busy=useRef(0);

  const goTo=useCallback((index:number,focus=false)=>{
    const el=section.current;
    if(!el)return;
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    if(compact.current){setActive(index);activeRef.current=index;}
    else {const box=el.getBoundingClientRect();busy.current=performance.now()+700;window.scrollTo({top:box.top+window.scrollY+(box.height-window.innerHeight)*(index+.5)/features.length,behavior:media.matches?"instant":"smooth"});}
    if(focus)buttons.current[index]?.focus({preventScroll:true});
  },[]);

  useEffect(()=>{
    const el=section.current;if(!el)return;
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame=0,lastWheel=0,accumulated=0,touchStart=0,touchMoved=false;
    const update=()=>{frame=0;compact.current=reduced.matches||window.innerHeight<=620;const box=el.getBoundingClientRect();if(!compact.current){const progress=Math.max(0,Math.min(.9999,-box.top/Math.max(1,box.height-window.innerHeight)));const index=Math.min(features.length-1,Math.floor(progress*features.length));if(index!==activeRef.current){activeRef.current=index;setActive(index);}}};
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    const isPinned=()=>{const box=el.getBoundingClientRect();return !compact.current&&box.top<=2&&box.bottom>=window.innerHeight-2;};
    const advance=(direction:number)=>{const next=activeRef.current+direction;if(next<0||next>=features.length)return false;goTo(next);return true;};
    const copyCanScroll=(target:EventTarget|null,delta:number)=>{
      const copy=target instanceof Element?target.closest<HTMLElement>(".feature-copy"):null;
      return !!copy&&copy.scrollHeight>copy.clientHeight+1&&(delta>0?copy.scrollTop+copy.clientHeight<copy.scrollHeight-1:copy.scrollTop>0);
    };
    const wheel=(event:WheelEvent)=>{
      if(event.ctrlKey||event.deltaY===0||!isPinned()||copyCanScroll(event.target,event.deltaY))return;
      const now=performance.now(),gap=now-lastWheel;lastWheel=now;
      if(now<busy.current){event.preventDefault();return;}
      accumulated=gap>140?Math.abs(event.deltaY):accumulated+Math.abs(event.deltaY);
      if(accumulated<25)return;
      if(advance(event.deltaY>0?1:-1)){accumulated=0;event.preventDefault();}
    };
    const start=(event:TouchEvent)=>{if(event.touches.length!==1){touchMoved=true;return;}touchStart=event.touches[0].clientY;touchMoved=false;};
    const move=(event:TouchEvent)=>{if(event.touches.length!==1||!isPinned())return;const delta=touchStart-event.touches[0].clientY;if(copyCanScroll(event.target,delta))return;if((activeRef.current===0&&delta<0)||(activeRef.current===features.length-1&&delta>0))return;if(touchMoved||performance.now()<busy.current){if(event.cancelable)event.preventDefault();return;}if(Math.abs(delta)>28&&advance(delta>0?1:-1)){touchMoved=true;if(event.cancelable)event.preventDefault();}};
    const key=(event:globalThis.KeyboardEvent)=>{const target=event.target as HTMLElement;if(target.closest("button,a,input,textarea,select,[contenteditable=true],[role=tabpanel]"))return;if(!isPinned()||!["ArrowDown","ArrowUp","PageDown","PageUp"," "].includes(event.key))return;if(performance.now()<busy.current){event.preventDefault();return;}if(advance(event.key==="ArrowUp"||event.key==="PageUp"||(event.key===" "&&event.shiftKey)?-1:1))event.preventDefault();};
    const observer=new IntersectionObserver(([entry])=>{setVisible(entry.isIntersecting);},{threshold:0});observer.observe(el);
    window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule);window.addEventListener("wheel",wheel,{passive:false});window.addEventListener("touchstart",start,{passive:true});window.addEventListener("touchmove",move,{passive:false});window.addEventListener("keydown",key);reduced.addEventListener("change",schedule);update();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);window.removeEventListener("wheel",wheel);window.removeEventListener("touchstart",start);window.removeEventListener("touchmove",move);window.removeEventListener("keydown",key);reduced.removeEventListener("change",schedule);};
  },[goTo]);

  function tabKey(event:KeyboardEvent<HTMLButtonElement>,index:number){let next=index;if(event.key==="ArrowRight"||event.key==="ArrowDown")next=(index+1)%features.length;else if(event.key==="ArrowLeft"||event.key==="ArrowUp")next=(index+features.length-1)%features.length;else if(event.key==="Home")next=0;else if(event.key==="End")next=features.length-1;else return;event.preventDefault();event.stopPropagation();goTo(next,true);}

  return <section className="features-scroll" id="services" ref={section} aria-labelledby="services-title" data-visible={visible}><div className="features-sticky"><h2 id="services-title" className="section-heading">Our Capabilities</h2><div className={`feature-card feature-active-${active}`}><div className="feature-left"><div className="feature-copy-stack">{features.map((feature,index)=><div className={`feature-copy${active===index?" is-active":""}`} id={`feature-panel-${index}`} role="tabpanel" tabIndex={active===index?0:-1} aria-labelledby={`feature-tab-${index}`} aria-hidden={active!==index} inert={active!==index} key={feature.tab}><span className="feature-label">{feature.label}</span><h3>{feature.lines.map(line=><span key={line}>{line}</span>)}</h3><p>{feature.description}</p><a className="button button-outline" href="#contact">Book a Demo <Arrow/></a></div>)}</div></div><div className="feature-right" aria-hidden="true">{[<OrbitField key="orbit"/>,<MarketFlow key="flow"/>,<BriefWall key="wall"/>,<EvidenceRuler key="ruler"/>].map((visual,index)=><div className={`feature-visual feature-visual-${index}${active===index?" is-active":""}`} key={index}>{visual}</div>)}</div></div><div className="feature-rail" role="tablist" aria-label="Capability areas" aria-orientation="vertical">{features.map((feature,index)=><button key={feature.tab} type="button" id={`feature-tab-${index}`} ref={el=>{buttons.current[index]=el;}} role="tab" title={feature.tab} aria-label={feature.tab} aria-selected={active===index} aria-controls={`feature-panel-${index}`} tabIndex={active===index?0:-1} onClick={()=>goTo(index)} onKeyDown={event=>tabKey(event,index)}><span className={index<active?"is-past":""}/></button>)}</div></div></section>;
}
