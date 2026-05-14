export type PhraseGroup = {
  category: string;
  description: string;
  phrases: { phrase: string; reason: string }[];
};

export const phraseLibrary: PhraseGroup[] = [
  {
    category: "Financial Urgency",
    description: "Phrases that create panic about money so you act before thinking.",
    phrases: [
      { phrase: "Your account will be blocked in 30 minutes", reason: "Banks never give such short deadlines on a phone call." },
      { phrase: "Transfer the money immediately to a safe RBI account", reason: "RBI does not hold personal accounts. This is always a scam." },
      { phrase: "Pay a small processing fee to release your refund", reason: "Real refunds never require an upfront payment." },
      { phrase: "Your KYC is expiring today", reason: "KYC is never updated by phone or random links." },
      { phrase: "Last chance to keep your money safe", reason: "Urgency is the most common pressure tactic." },
      { phrase: "We need a one rupee verification on UPI", reason: "Even a one rupee request can authorize a much bigger debit." },
      { phrase: "There is a problem with your last transaction", reason: "Used to make you confirm card or OTP details that scammers steal." },
      { phrase: "Pay GST and the prize money will be credited", reason: "No legitimate prize asks for tax over phone before payout." },
    ],
  },
  {
    category: "Impersonation Tactics",
    description: "Phrases used to pretend they are from a trusted office or company.",
    phrases: [
      { phrase: "I am calling from CBI Mumbai branch", reason: "CBI does not call citizens directly to collect money or details." },
      { phrase: "This is from RBI head office", reason: "RBI never contacts individual customers by phone." },
      { phrase: "I am the manager of your bank branch", reason: "Branch managers do not ask for OTP or PIN, ever." },
      { phrase: "We are calling from TRAI regarding your SIM", reason: "TRAI does not contact subscribers about SIM blocking." },
      { phrase: "This is income tax department on a recorded line", reason: "IT department uses written notices, not threatening phone calls." },
      { phrase: "I am a customs officer at Delhi airport", reason: "Customs never calls about parcels and asks for personal payment." },
      { phrase: "Calling from Microsoft technical support", reason: "Microsoft does not make unsolicited support calls." },
      { phrase: "This is your courier company supervisor", reason: "Couriers do not call to demand fees or ask for OTPs." },
    ],
  },
  {
    category: "Fear and Threat Language",
    description: "Phrases meant to scare you so you stop checking facts.",
    phrases: [
      { phrase: "A non bailable warrant is issued in your name", reason: "Warrants are served by courts in writing, never on a call." },
      { phrase: "You are under digital arrest until verification is done", reason: "There is no such thing as digital arrest in Indian law." },
      { phrase: "Your Aadhaar is being used in a money laundering case", reason: "Standard scare tactic to make you panic and pay." },
      { phrase: "Police is on the way to your house right now", reason: "Real police do not announce their arrival to take money." },
      { phrase: "Do not disconnect this call or you will be arrested", reason: "Scammers want to keep you isolated from family and police." },
      { phrase: "Your name is in a drug parcel from Iran", reason: "A scripted threat to start the digital arrest scam." },
      { phrase: "If you tell anyone we will block your bank account", reason: "Isolation is the scammer's biggest weapon." },
      { phrase: "FIR will be filed in the next 30 minutes against you", reason: "FIRs are filed at police stations, not over phone calls." },
    ],
  },
  {
    category: "OTP and Data Requests",
    description: "Phrases used to steal one time passwords and personal data.",
    phrases: [
      { phrase: "Please share the six digit OTP you just received", reason: "No legitimate company or bank asks for OTPs on a call." },
      { phrase: "Read out the CVV number on the back of your card", reason: "CVV is needed only when you make a purchase yourself." },
      { phrase: "Tell me the last four digits of your debit card", reason: "Used to confirm your identity for an unauthorized transaction." },
      { phrase: "Install AnyDesk so I can fix this remotely", reason: "Screen sharing apps give scammers full access to your phone." },
      { phrase: "Forward this SMS to me to complete verification", reason: "Forwarding banking SMS lets scammers reset your accounts." },
      { phrase: "Send me a screenshot of your UPI app", reason: "Screenshots can leak account number and balance information." },
      { phrase: "What is your mother's maiden name for security check", reason: "Standard security questions are used to take over your accounts." },
      { phrase: "Click the link I just sent and log in again", reason: "These links open phishing pages that steal your password." },
    ],
  },
  {
    category: "Family Emergency Manipulation",
    description: "Phrases used in voice cloning and fake relative scams.",
    phrases: [
      { phrase: "Mummy please send money fast I am in trouble", reason: "Vague urgency without naming the situation is a clone scam sign." },
      { phrase: "I had an accident do not tell papa", reason: "Designed to keep you from confirming with the rest of the family." },
      { phrase: "I am in police custody help me first", reason: "Real police allow you to verify identity through known channels." },
      { phrase: "My phone is broken so I am calling from this number", reason: "The most common excuse for an unfamiliar number." },
      { phrase: "Pay this stranger and I will explain later", reason: "Payment to a third party with no explanation is always suspicious." },
      { phrase: "Just transfer the money I will repay tomorrow", reason: "Repayment promises are used to push past your hesitation." },
      { phrase: "Do not call back I cannot talk now", reason: "Stops you from verifying using your family member's real number." },
      { phrase: "Keep this between us for now", reason: "Isolation tactic to prevent the rest of the family from intervening." },
    ],
  },
];
