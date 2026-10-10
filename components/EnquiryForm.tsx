"use client";

import { type FormEvent, useState } from "react";
import { Arrow } from "./Brand";
import { ENQUIRY_EMAIL, enquiryPayload, type Enquiry } from "../lib/enquiry";

const emptyEnquiry: Enquiry = { name: "", email: "", company: "", question: "", timeline: "" };

export default function EnquiryForm() {
  const [brief, setBrief] = useState<Enquiry>(emptyEnquiry);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [status, setStatus] = useState("");

  function update(field: keyof Enquiry, value: string) {
    setBrief(current => ({ ...current, [field]: value }));
    setSubmitted(false);
    setFailed(false);
    setStatus("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || submitted) return;
    if (!event.currentTarget.reportValidity()) return;
    if (!brief.name.trim() || !brief.question.trim()) {
      setStatus("Complete your name and business challenge.");
      return;
    }

    setPending(true);
    setFailed(false);
    setStatus("Submitting your demo request…");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiryPayload(brief)), signal: AbortSignal.timeout(30000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true || !Number.isSafeInteger(result.id) || result.id <= 0) {
        throw new Error(response.status === 429 ? "Too many requests. Please wait a few minutes and try again." : "We couldn’t submit your request. Please try again or contact us by email.");
      }
      setSubmitted(true);
      setStatus(`Your demo request has been received. We’ll contact you at ${brief.email.trim()}.`);
    } catch (error) {
      setFailed(true);
      setStatus(error instanceof Error && error.message.startsWith("Too many requests.") ? error.message : "We couldn’t submit your request. Please try again or contact us by email.");
    } finally { setPending(false); }
  }

  return <form className="brief-form enter-item" onSubmit={submit}>
    <div className="form-row">
      <label htmlFor="brief-name">Name<input id="brief-name" name="name" autoComplete="name" required maxLength={200} placeholder="Your name" value={brief.name} onChange={event => update("name", event.target.value)} /></label>
      <label htmlFor="brief-email">Work email<input id="brief-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" value={brief.email} onChange={event => update("email", event.target.value)} /></label>
    </div>
    <label htmlFor="brief-company">Company / Project <span className="optional">(optional)</span><input id="brief-company" name="company" autoComplete="organization" maxLength={200} placeholder="Your team or product" value={brief.company} onChange={event => update("company", event.target.value)} /></label>
    <label htmlFor="brief-question">What do you need help with?<textarea id="brief-question" name="question" required maxLength={4000} rows={3} placeholder="Share your product, business challenge and desired outcome." value={brief.question} onChange={event => update("question", event.target.value)} /></label>
    <label htmlFor="brief-timeline">Timeline <span className="optional">(optional)</span><input id="brief-timeline" name="timeline" maxLength={200} placeholder="When would you like to begin?" value={brief.timeline || ""} onChange={event => update("timeline", event.target.value)} /></label>
    <button className="button button-primary" type="submit" disabled={pending || submitted}>{pending ? "Submitting…" : submitted ? "Request Received" : "Book a Demo"} <Arrow /></button>
    <p className="form-helper">Send a demo request directly to IFAGRITHM.</p>
    <p className="form-status" role="status" aria-live="polite">{status}</p>
    {failed ? <a className="enquiry-email" href={`mailto:${ENQUIRY_EMAIL}`}>Contact {ENQUIRY_EMAIL}</a> : null}
  </form>;
}
