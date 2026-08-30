/** Founder-approved routing. Listing an address does not verify mailbox provisioning. */
export const WRNC_CONTACT_EMAILS = {
  founder: 'travis@wrnc.app',
  support: 'support@wrnc.app',
  feedback: 'feedback@wrnc.app',
  privacy: 'privacy@wrnc.app',
  legal: 'legal@wrnc.app',
  security: 'security@wrnc.app',
  beta: 'beta@wrnc.app',
  sponsorship: 'sponsor@wrnc.app',
  billing: 'billing@wrnc.app',
} as const;

// Outbound only. Deliberately excluded from the contact type used by UI links.
export const WRNC_SYSTEM_SENDER = 'noreply@wrnc.app';
export type WrncContactEmail = typeof WRNC_CONTACT_EMAILS[keyof typeof WRNC_CONTACT_EMAILS];
