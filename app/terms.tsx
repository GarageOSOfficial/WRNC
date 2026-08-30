import { useRouter } from 'expo-router';
import React from 'react';
import { WRNC_CONTACT_EMAILS } from '../lib/contactEmails';
import { PreparedContentPage, PreparedContentSection } from '../components/legal/PreparedContentPage';

const sections: PreparedContentSection[] = [
  { title: 'Contracting party', body: ['WRNC is operated by Swear Like A Sailor, LLC. [COUNSEL REVIEW REQUIRED: confirm complete legal identity and notice address.]'] },
  { title: 'Eligibility and account responsibilities', body: ['[FOUNDER AND COUNSEL DECISION REQUIRED: age threshold, authority to agree, credential security, and account accuracy.]'] },
  { title: 'Service scope and acceptable use', body: ['[PRODUCT AND COUNSEL REVIEW REQUIRED: define the service, prohibited conduct, moderation, suspension, and termination.]'] },
  { title: 'Builder content and licenses', body: ['[FOUNDER AND COUNSEL DECISION REQUIRED: ownership, upload permissions, platform license, feedback, removal, and export.]'] },
  { title: 'Vehicle records and ownership transfer', body: ['[PRODUCT AND COUNSEL DECISION REQUIRED: record accuracy, vehicle ownership claims, collaboration rights, transfer procedure, and disputes.]'] },
  { title: 'OEM and third-party materials', body: ['[COUNSEL REVIEW REQUIRED: trademarks, specifications, licensed data, external services, and third-party terms.]'] },
  { title: 'Payments, refunds, and future paid services', body: ['[FOUNDER AND COUNSEL DECISION REQUIRED: pricing, subscriptions, renewal, cancellation, taxes, and refunds. Remove this section if paid services are out of scope.]'], contacts: [{ label: 'Billing (future)', email: WRNC_CONTACT_EMAILS.billing }] },
  { title: 'Disclaimers and allocation of risk', body: ['[COUNSEL DRAFT REQUIRED: warranties, automotive-safety limitations, liability cap, exclusions, indemnification, and force majeure.]'] },
  { title: 'Disputes and governing terms', body: ['[FOUNDER AND COUNSEL DECISION REQUIRED: governing law, venue, arbitration, class-action waiver, informal resolution, and opt-out procedure.]'] },
  { title: 'Changes, notices, and contact', body: ['[COUNSEL REVIEW REQUIRED: effective date, amendment notice, electronic communications, legal notices, address, and monitored contact.]'], contacts: [{ label: 'Legal and intellectual property inquiries', email: WRNC_CONTACT_EMAILS.legal }] },
];

export default function TermsScreen() {
  const router = useRouter();
  return <PreparedContentPage description="This route prepares the Terms location and decision structure. No placeholder is a contractual term, and no user assent is active." eyebrow="LEGAL PREPARATION" onBack={() => router.replace('/')} sections={sections} status="DRAFT. NOT APPROVED OR EFFECTIVE. NO USER ASSENT IS BEING COLLECTED." title="TERMS OF SERVICE" />;
}
