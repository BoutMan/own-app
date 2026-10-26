/**
 * Terms of Use and Privacy Policy, one source for the in-app pages (src/app/legal) and the hosted
 * pages the App Store needs (npm run legal → legal/*.html). DRAFT: to be reviewed by a lawyer and
 * completed (ENTITY) before release. Every privacy statement must stay true in the code
 * (CLAUDE.md, rules 1 and 2).
 */

/** To fill in before release. */
export const ENTITY = {
  name: '[Company legal name]',
  address: '[Postal address]',
  email: '[contact email]',
  state: '[State]',
  effective: '[Effective date]',
} as const;

export type LegalSection = { heading: string; paragraphs: string[] };
export type LegalDoc = { id: 'terms' | 'privacy'; title: string; accent: string; intro: string; sections: LegalSection[] };

export const privacyPolicy: LegalDoc = {
  id: 'privacy',
  title: 'Privacy Policy',
  accent: 'Privacy',
  intro: `Own is built so that we never see your data. Everything you record stays on your phone. This policy explains what that means in practice. Effective ${ENTITY.effective}.`,
  sections: [
    {
      heading: 'What stays on your phone',
      paragraphs: [
        'Your workouts and loads, health check answers, cycle, feelings, markers, tests, check-ins, measurements, goals, rituals and progress photos are stored only in the app on your device. We do not run a server that receives them, and we cannot access them.',
        'Progress photos are kept inside the app, behind Face ID or your passcode. They are never saved to your photo library and never uploaded.',
      ],
    },
    {
      heading: 'What we collect',
      paragraphs: [
        'Nothing. Own contains no analytics, no advertising or attribution tools, no crash reporting service and no tracking of any kind. We do not sell, rent or share data, because we do not have any.',
      ],
    },
    {
      heading: 'Purchases',
      paragraphs: [
        'Subscriptions are sold by Apple (or Google on Android). To check that your plan is active, the app uses RevenueCat, which receives a random purchase identifier created on your phone and the receipt from the store. It never receives your name, your health or training data, or anything you record in Own. Apple and RevenueCat process this under their own privacy policies.',
      ],
    },
    {
      heading: 'Permissions',
      paragraphs: [
        'Camera: only to take your progress photos, which stay in the app. Face ID: handled by iOS to unlock your photo vault; we never receive your face data. Notifications: reminders are scheduled on your phone. Calendar: only if you ask, Own adds your session times to a separate "Own" calendar with neutral titles.',
        'If your phone calendar syncs with an online account, that sync is between you and your calendar provider.',
      ],
    },
    {
      heading: 'Backups',
      paragraphs: [
        'Your data is included in your device backup (iCloud or computer), which you control. Own does not copy it anywhere itself. Without a backup, losing your phone means losing your Own data: we have no copy to restore.',
      ],
    },
    {
      heading: 'Your control',
      paragraphs: [
        'In Settings → Data & privacy you can export your records as one file you share yourself (your photos stay in the vault), erase your cycle history, or erase all your data, photos included. Deleting the app also deletes everything it stored.',
      ],
    },
    {
      heading: 'Health information',
      paragraphs: [
        'Own is a fitness and education app. It does not provide medical advice, diagnosis or treatment. Health information you enter is used only on your phone to adapt your sessions.',
      ],
    },
    {
      heading: 'Children',
      paragraphs: ['Own is not intended for anyone under 16.'],
    },
    {
      heading: 'Changes and contact',
      paragraphs: [
        'If this policy changes, the new version will be in the app and on our website, with its date. Any change that would send data off your phone would need your explicit consent first.',
        `${ENTITY.name}, ${ENTITY.address}. Questions: ${ENTITY.email}.`,
      ],
    },
  ],
};

export const termsOfUse: LegalDoc = {
  id: 'terms',
  title: 'Terms of Use',
  accent: 'Terms',
  intro: `These terms apply when you use Own, an app published by ${ENTITY.name}. By using Own you accept them. Effective ${ENTITY.effective}.`,
  sections: [
    {
      heading: 'Not medical advice',
      paragraphs: [
        'Own offers strength training, movement and wellbeing guidance for general fitness. It is not a medical service and does not diagnose, treat or prevent any condition. Talk to a doctor before starting, especially if you are pregnant or postpartum, have a health condition, an injury, or have not exercised in a long time. Stop and seek advice if you feel pain, dizziness or anything unusual.',
        'You train at your own pace and under your own responsibility. Choose loads you can control and follow the safety cues in each session.',
      ],
    },
    {
      heading: 'Subscription',
      paragraphs: [
        'Own is a paid app. The yearly plan includes a free trial when offered; at the end of the trial, the subscription starts and is charged to your Apple ID account unless you cancel at least 24 hours before the trial ends.',
        'Subscriptions renew automatically at the same price and period unless cancelled at least 24 hours before the end of the current period. You can manage or cancel your subscription in your App Store account settings. Prices are shown in the app before you buy. Refunds are handled by Apple under its policies.',
        'Codes given to buyers of the Own guide are App Store offer codes, redeemed in the App Store under its terms.',
      ],
    },
    {
      heading: 'Your data',
      paragraphs: [
        'What you record stays on your phone, as described in our Privacy Policy. You are responsible for keeping your device backed up if you want to keep your data when you change phones.',
      ],
    },
    {
      heading: 'Licence',
      paragraphs: [
        'We grant you a personal, non-transferable licence to use Own on devices you own or control, under the Apple Standard Licensed Application End User License Agreement (EULA), which also applies. The programme, texts, photos and videos in Own are protected; please do not copy or redistribute them.',
      ],
    },
    {
      heading: 'Liability',
      paragraphs: [
        `Own is provided "as is". To the extent permitted by law, ${ENTITY.name} is not liable for injuries, losses or damages resulting from the use of the app, except where such liability cannot be excluded.`,
      ],
    },
    {
      heading: 'Changes, law and contact',
      paragraphs: [
        'We may update these terms; the current version is always in the app and on our website, with its date.',
        `These terms are governed by the laws of the State of ${ENTITY.state}, United States. Contact: ${ENTITY.email}, ${ENTITY.address}.`,
      ],
    },
  ],
};

export const legalDocs = { terms: termsOfUse, privacy: privacyPolicy } as const;
