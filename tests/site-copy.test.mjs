import test from "node:test";
import assert from "node:assert/strict";
import { capabilities, stages, sectors, questions, companyDescriptor, pageTitle, heroHeadline } from "../lib/site-content.ts";
import { ENQUIRY_EMAIL, ENQUIRY_SUBJECT, enquiryEmailUrl, enquiryGmailUrl, enquiryMessage, enquiryPayload } from "../lib/enquiry.ts";

test("company identity and four scoped capabilities match the rebrand brief", () => {
  assert.equal(companyDescriptor, "Web3 Research & Business Services");
  assert.equal(pageTitle, `IFAGRITHM | ${companyDescriptor}`);
  assert.equal(heroHeadline, "Research and business support for Web3 teams.");
  assert.deepEqual(capabilities.map(item => item.tab), ["Research & Intelligence", "Data & Analytics", "Growth & Partnerships", "Custom Business Engagements"]);
  assert.match(capabilities[2].description, /suitable delivery capacity/);
  assert.match(capabilities[3].description, /assess the scope/);
  assert.deepEqual(stages.map(item => item.title), ["Desire", "Behaviour", "Business"]);
  assert.equal(sectors.length, 4);
  assert.equal(questions.length, 7);
  assert.match(questions[6].answer, /^No\./);
});

test("demo requests retain the optional timeline in the existing store payload", () => {
  const enquiry = { name: " Ada ", email: " ada@example.com ", company: " Example ", question: " Study our users ", timeline: " November " };
  assert.deepEqual(enquiryPayload(enquiry), {name:"Ada",email:"ada@example.com",company:"Example",question:"Study our users\n\nTimeline: November"});
  assert.equal(enquiryPayload({...enquiry,timeline:undefined}).question,"Study our users");
});

test("project enquiry draft retains verified recipient and optional timeline", () => {
  const brief = { name: " Ada ", email: "ada@example.com", company: "Example & Co", question: "Assess our users & competitors", timeline: " November " };
  const message = enquiryMessage(brief);
  assert.equal(ENQUIRY_EMAIL, "Ifagrithm@gmail.com");
  assert.equal(ENQUIRY_SUBJECT, "IFAGRITHM project enquiry");
  assert.match(message, /Name: Ada/);
  assert.match(message, /Company \/ Project: Example & Co/);
  assert.match(message, /Timeline: November/);
  assert.match(message, /Business challenge:/);
  const mailto = new URL(enquiryEmailUrl(brief));
  const gmail = new URL(enquiryGmailUrl(brief));
  assert.equal(mailto.pathname, ENQUIRY_EMAIL);
  assert.equal(mailto.searchParams.get("body"), message);
  assert.equal(gmail.searchParams.get("to"), ENQUIRY_EMAIL);
  assert.equal(gmail.searchParams.get("body"), message);
  assert.match(enquiryMessage({ ...brief, timeline: undefined }), /Timeline: Not provided/);
});
