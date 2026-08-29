import { useRouter } from 'expo-router';
import React from 'react';
import { PreparedContentPage, PreparedContentSection } from '../components/legal/PreparedContentPage';

const sections: PreparedContentSection[] = [
  { title: 'What WRNC is building', body: ['WRNC is a vehicle build documentation and collaboration platform designed to keep a Builder’s vehicle records, photos, receipts, work history, and build story connected.'] },
  { title: 'Who it is for', body: ['WRNC is built for people documenting real vehicle projects, from the first plan and part through the work that follows.'] },
  { title: 'Company', body: ['WRNC is operated by Swear Like A Sailor, LLC, a Washington limited liability company. [FOUNDER REVIEW REQUIRED: approve public company description and any additional company details.]'] },
  { title: 'Contact', body: ['General: contact@wrnc.app', 'Support: support@wrnc.app', '[FOUNDER REVIEW REQUIRED: confirm both mailboxes are monitored before public release.]'] },
];

export default function AboutScreen() {
  const router = useRouter();
  return <PreparedContentPage description="Every build deserves a living record." eyebrow="ABOUT WRNC" onBack={() => router.replace('/')} sections={sections} status="PREPARED COPY. FOUNDER REVIEW REQUIRED BEFORE PUBLICATION." title="BUILT FOR BUILDERS." />;
}
