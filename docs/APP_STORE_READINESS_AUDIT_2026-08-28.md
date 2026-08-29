# WRNC App Store Readiness Audit

Audit date: 2026-08-28

Scope: source and configuration review of `feat/legal-link-preparation`, rendered web checks, and current Apple and Expo requirements. This is a readiness audit, not legal advice or proof of App Store acceptance.

## Submission blockers

### 1. In-app account deletion is absent

Status: Not met.

Evidence: WRNC supports account creation in `app/signup.tsx`. No authenticated settings route, account-deletion UI, deletion service, or backend deletion workflow exists in the audited branch. Existing vehicle and activity removal behavior is archival, not user-account deletion.

Requirement: Apple requires apps that support account creation to let users initiate deletion of the entire account inside the app. Deactivation alone and ordinary email support flows are insufficient for apps outside highly regulated industries. Source: [Apple, Offering account deletion in your app](https://developer.apple.com/support/offering-account-deletion-in-your-app/).

Founder gate: Approve a separately scoped authentication and data-deletion design. It must define reauthentication, deletion of account-linked database records and private storage objects, legally required retention exceptions, backup handling, failure recovery, and confirmation messaging. This sprint does not alter auth, storage, migrations, or RLS.

### 2. Final privacy notice and public Privacy Policy URL are absent

Status: Preparation only.

Evidence: `/privacy` now exists as an explicitly unapproved placeholder route. It does not contain final legal text and must not be submitted as the App Store Privacy Policy URL. No production deployment was performed.

Requirement: Apple requires a privacy-policy link in App Store Connect and within the app in an easily accessible location. The policy must accurately cover collection, use, third parties, retention, deletion, and user choices. Sources: [Apple App Review Guidelines, section 5.1.1](https://developer.apple.com/app-store/review/guidelines/) and [App Store Connect App privacy](https://developer.apple.com/help/app-store-connect/reference/app-privacy/).

Founder gate: Approve counsel-reviewed final text, confirm monitored contacts and operator details, approve publication, deploy to a stable HTTPS URL, and enter that exact URL in App Store Connect.

### 3. App Privacy disclosure inventory is incomplete

Status: Not met.

Code-observed candidate data types requiring App Store Connect decisions:

* Contact information: account email and Founding Builder application email.
* User content: vehicle details, VIN, mileage, nicknames, activity titles and descriptions, photos, receipts, registrations, insurance documents, warranties, manuals, title documents, and other uploaded files.
* Identifiers: Supabase user ID, vehicle ID, workspace ID, activity ID, document ID, and private storage paths.
* Other data: Founding Builder general location, build description, project stage, documentation method, goals, availability, and participation responses.
* Web-only diagnostics or analytics candidate: Coming Soon referrer and UTM values passed to Vercel Analytics. This audit did not add or change that script.
* Third-party processing candidate: Supabase authentication, database, and storage. Apple requires integrated third-party partners to be included in responses.

Requirement: disclosures must cover the app and integrated third-party code, state purposes, and identify whether data is linked to the user or used for tracking. Sources: [Apple, Manage app privacy](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/) and [Apple, App Privacy Details](https://developer.apple.com/app-store/app-privacy-details/).

Founder gate: Approve a verified data map covering the shipped iOS binary, Supabase configuration, server behavior, every SDK, retention, and tracking definitions before completing App Store Connect answers.

### 4. Native production build and signing readiness are unproven

Status: Partially configured, not verified.

Evidence present: iOS bundle identifier `com.wrnc.mobile`, build number `1`, EAS project ID, and a production iOS build profile. Evidence absent from this sprint: successful current production `.ipa`, distribution certificate, provisioning profile, App Store Connect API key or app-specific password, confirmed App Store Connect app ID, confirmed Apple team ID, and processed TestFlight build. The `$APPLE_ID`, `$ASC_APP_ID`, and `$APPLE_TEAM_ID` entries in `eas.json` are placeholders, not proof that secrets or identifiers are configured.

Requirement: Expo documents a paid Apple Developer account, bundle identifier, authenticated EAS configuration, production build, and App Store submission credentials. Sources: [Expo, Submit to the Apple App Store with EAS Submit](https://docs.expo.dev/submit/ios/) and [Expo, Create a production build for iOS](https://docs.expo.dev/tutorial/eas/ios-production-build/).

Founder gate: Approve a non-production-changing credentials and build verification session. Do not paste Apple or Expo credentials into chat or commit them.

### 5. Reviewer access is unprepared

Status: Unknown or not evidenced.

Evidence: Authentication gates the app workspace. No App Review notes, stable review account, review instructions, seeded review data, or support escalation procedure is present in the repository.

Founder gate: Approve a dedicated non-privileged review account and review notes. Verify that review credentials work in the submitted TestFlight build and expose representative features without production customer data.

### 6. Support URL is not established

Status: Not met or not evidenced.

Evidence: `support@wrnc.app` remains a mail action in the shared footer. No approved public support web route or confirmed App Store Connect Support URL was found. The prepared `/about` route visibly requires confirmation that the mailbox is monitored.

Founder gate: Approve a stable HTTPS support destination with contact method, response expectations, account-deletion directions that do not replace in-app deletion, and basic troubleshooting.

## Launch blockers

### 7. Physical iPhone lifecycle QA is not complete

Status: Not met in this sprint.

Required evidence: install and cold launch, signup and confirmation, sign in and sign out, authenticated relaunch, keyboard and Safari scrolling, camera and photo permission prompts, photo selection, document selection including supported iPhone formats, private signed-URL viewing, upload failure rollback, offline and recovery behavior, account deletion when implemented, and TestFlight upgrade behavior.

Founder gate: Provide a current physical iPhone and approved test accounts after a signed TestFlight build exists.

### 8. Camera and photo permission strings need native verification

Status: Configured in source, not verified in a built binary.

Evidence: `app.json` configures Expo Image Picker strings: “Allow WRNC to access your photos and videos for vehicle documentation.” and “Allow WRNC to access your camera to document your builds.” The repository uses photo-library selection. No microphone dependency or microphone request was found in this audit.

Requirement: protected-resource usage descriptions must accurately explain why access is requested and must be present when the API is used. Source: [Apple, Protecting the User’s Privacy](https://developer.apple.com/documentation/uikit/protecting-the-user-s-privacy).

Founder gate: Inspect the generated iOS Info.plist and permission dialogs in the signed candidate. Confirm the wording matches the shipped feature and does not request broader access than needed.

### 9. Sign in with Apple decision is unresolved

Status: Conditional blocker.

Evidence: No Sign in with Apple SDK, OAuth provider call, Apple credential storage, or Apple token-revocation workflow was found. Current source shows email and password authentication. If another third-party login is added, Apple guideline 4.8 must be evaluated. If Sign in with Apple is added, deletion must revoke Apple tokens and clear associated credentials and data.

Sources: [Apple App Review Guidelines, section 4.8](https://developer.apple.com/app-store/review/guidelines/), [Apple, Offering account deletion in your app](https://developer.apple.com/support/offering-account-deletion-in-your-app/), and [Apple TN3194](https://developer.apple.com/documentation/technotes/tn3194-handling-account-deletions-and-revoking-tokens-for-sign-in-with-apple).

Founder gate: Confirm the launch authentication set. Do not add Sign in with Apple inside this legal preparation sprint.

## Post-launch

* Localize legal pages and App Store metadata after final English text and launch territories are approved.
* Establish scheduled reviews for privacy disclosures, SDK changes, vendor changes, retention, and support contacts.
* Add automated accessibility and visual-regression coverage after the prepared routes become approved public content.
* Define a documented privacy-request operations process, metrics, and escalation path after counsel confirms applicable jurisdictions and response duties.

## Validation evidence

* TypeScript check: passed.
* ESLint: passed.
* Focused tests: 19 passed across 4 suites.
* Full Jest suite: 217 passed across 36 suites. Jest reported an open-handle warning after completing all tests.
* Web export: passed. Expo exported the app to `dist`.
* Runtime at 390 by 844: `/privacy` rendered its draft warning and measured `document.documentElement.scrollWidth === clientWidth === 390`.
* Runtime at 1440 by 900: `/about`, `/terms`, and `/signup` each measured zero horizontal overflow. `/signup` rendered no legal-agreement control.
* Shared footer: About, Privacy, and Terms routed to the prepared pages. Six existing social controls remained present. The `Built for Builders.` signature remained visible.

## Explicit exclusions

No merge, production deployment, authentication change, storage change, migration, RLS change, analytics or script addition, cookie addition, or major feature expansion was performed.
