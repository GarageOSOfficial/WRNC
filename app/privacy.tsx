import { useRouter } from 'expo-router';
import React from 'react';
import { WRNC_CONTACT_EMAILS } from '../lib/contactEmails';
import { PreparedContentPage, PreparedContentSection } from '../components/legal/PreparedContentPage';

const sections: PreparedContentSection[] = [
  { title: 'Operator', body: ['WRNC is operated by Swear Like A Sailor, LLC. [COUNSEL REVIEW REQUIRED: confirm complete legal identity, address, and privacy contact before publication.]'] },
  { title: 'Information WRNC handles', items: ['[INVENTORY REQUIRED: account and profile data.]', '[INVENTORY REQUIRED: vehicle, build, photo, document, receipt, and activity data.]', '[INVENTORY REQUIRED: device, diagnostics, support, and third-party service data.]'] },
  { title: 'Purposes and legal bases', body: ['[COUNSEL AND PRODUCT DECISION REQUIRED: specify each processing purpose and any applicable legal basis. Do not publish generic language.]'] },
  { title: 'Service providers and disclosures', body: ['[VENDOR INVENTORY REQUIRED: identify every service provider and third party that receives data, why it receives data, and applicable safeguards.]'] },
  { title: 'Retention and deletion', body: ['[FOUNDER AND COUNSEL DECISION REQUIRED: define retention periods, deletion exceptions, backup handling, and the account-deletion process.]'] },
  { title: 'Privacy rights and choices', body: ['[COUNSEL REVIEW REQUIRED: identify applicable rights, request methods, identity verification, appeal or complaint rights, and consent withdrawal.]'] },
  { title: 'Security and international processing', body: ['[SECURITY AND COUNSEL REVIEW REQUIRED: describe safeguards and cross-border processing accurately without making unsupported guarantees.]'], contacts: [{ label: 'Security reporting', email: WRNC_CONTACT_EMAILS.security }] },
  { title: 'Children and age eligibility', body: ['[FOUNDER AND COUNSEL DECISION REQUIRED: set the minimum age and any parental-consent rules.]'] },
  { title: 'Changes and contact', body: ['[COUNSEL REVIEW REQUIRED: effective date, update notice process, mailing address, and monitored privacy contact.]'], contacts: [{ label: 'Privacy inquiries', email: WRNC_CONTACT_EMAILS.privacy }] },
];

export default function PrivacyScreen() {
  const router = useRouter();
  return <PreparedContentPage description="This route reserves the public privacy-policy location and exposes every unresolved decision. It is not an approved privacy notice." eyebrow="LEGAL PREPARATION" onBack={() => router.replace('/')} sections={sections} status="DRAFT. NOT APPROVED OR EFFECTIVE. DO NOT RELY ON OR PUBLISH AS FINAL." title="PRIVACY NOTICE" />;
}
