export type AwarenessCategory = "Government" | "Financial" | "Family" | "Impersonation" | "Scheme";

export type AwarenessCard = {
  id: string;
  title: string;
  category: AwarenessCategory;
  howItWorks: string;
  redFlags: string[];
  whatToDo: string;
  isScheme?: boolean;
};

export const awarenessCards: AwarenessCard[] = [
  // EXISTING SCAM CARDS...
  {
    id: "fake-cbi",
    title: "Fake CBI Officer Call",
    category: "Government",
    howItWorks:
      "A caller claims to be from the CBI or Mumbai Crime Branch and says a parcel in your name contains drugs or your Aadhaar is linked to a money laundering case. They keep you on call for hours and demand you transfer money to a 'safe RBI account' for verification.",
    redFlags: [
      "Caller insists on staying on video or audio call without disconnecting",
      "Threatens immediate arrest or 'digital house arrest'",
      "Asks you to transfer money to an unknown account for verification",
      "Sends fake CBI or Supreme Court letters on WhatsApp",
    ],
    whatToDo:
      "Hang up. No real police officer asks for money. Call 1930 cyber crime helpline and report immediately at cybercrime.gov.in.",
  },
  {
    id: "electricity",
    title: "Fake Electricity Disconnection Threat",
    category: "Government",
    howItWorks:
      "An SMS or call warns that your electricity will be cut tonight at 9:30 PM because your last bill was not updated. You are asked to call a number or install an app like AnyDesk so a 'lineman' can fix it remotely.",
    redFlags: [
      "Message comes from a personal mobile number, not your DISCOM",
      "Asks you to install AnyDesk, TeamViewer or QuickSupport",
      "Pressures you to pay one rupee for 'verification' on a UPI link",
      "Threatens disconnection within hours",
    ],
    whatToDo:
      "Never install screen sharing apps for any utility. Check your bill on the official BSES, Tata Power, Adani or state board app and call their listed number.",
  },
  {
    id: "kyc",
    title: "Fake Bank KYC Expiry Call",
    category: "Financial",
    howItWorks:
      "Caller claims your bank account or PAN-Aadhaar link will be blocked today unless you complete KYC. They send a link or ask you to share an OTP, debit card number or CVV to 'reactivate' the account.",
    redFlags: [
      "Asks for OTP, CVV, ATM PIN or full card number",
      "Sends a KYC link over SMS or WhatsApp",
      "Says your account is blocking in the next 30 minutes",
      "Caller knows your name but asks you to confirm everything else",
    ],
    whatToDo:
      "Banks never ask for OTP or PIN. Disconnect, then visit your branch or use the official bank app. Report to 1930 if you shared any details.",
  },
  {
    id: "voice-clone",
    title: "Voice Cloned Family Emergency Scam",
    category: "Family",
    howItWorks:
      "You receive a call from an unknown number. The voice sounds exactly like your son, daughter or grandchild crying that they had an accident, are in police custody or kidnapped, and you must transfer money urgently to a stranger.",
    redFlags: [
      "Voice sounds familiar but the number is unknown",
      "Caller refuses to let you speak to anyone else or call back",
      "Demands UPI transfer within minutes",
      "Background sounds feel staged like sirens or shouting",
    ],
    whatToDo:
      "Stay calm. Hang up and call your family member directly on their saved number. Set a family safe word that real emergencies must include.",
  },
  {
    id: "delivery",
    title: "Fake Delivery Package Customs Fee",
    category: "Financial",
    howItWorks:
      "You get a call or SMS that a parcel from FedEx, DHL or Indian Customs is held at the airport because of suspicious contents in your name. They link the parcel to a money laundering case and demand a customs clearance fee.",
    redFlags: [
      "Mentions a parcel you never ordered",
      "Transfers the call to a 'police officer' or 'narcotics officer'",
      "Asks for payment in UPI or to a personal account",
      "Threatens that your Aadhaar will be misused if you do not pay",
    ],
    whatToDo:
      "Real couriers do not call you for customs. Hang up, do not press any number. Report the call to 1930 and the courier company on their official website.",
  },
  {
    id: "job",
    title: "Fake Job Offer with Registration Fee",
    category: "Financial",
    howItWorks:
      "You get a call or WhatsApp message offering a work from home job at Amazon, Flipkart or a hotel chain with a high salary. To start, you must pay a small registration, training or laptop deposit fee.",
    redFlags: [
      "Job offer without any interview or skill check",
      "Asks for money before joining for any reason",
      "HR uses a Gmail or personal WhatsApp, not a company domain",
      "Salary promised is unrealistically high for the work",
    ],
    whatToDo:
      "No genuine company asks candidates to pay. Verify the recruiter on the official company careers page and on LinkedIn before sharing anything.",
  },
  {
    id: "court",
    title: "Fake Court Summons Call",
    category: "Government",
    howItWorks:
      "Caller pretends to be a court clerk or advocate saying a non-bailable warrant has been issued against you for a missed hearing or a cheque bounce case. They offer to settle it on the spot if you pay a fine through UPI.",
    redFlags: [
      "Mentions a case you have never heard of",
      "Threatens arrest within 2 to 4 hours",
      "Sends a PDF summons with poor formatting and wrong seals",
      "Asks for money to 'avoid' the warrant",
    ],
    whatToDo:
      "Courts in India never call people to collect fines on UPI. Verify any case at ecourts.gov.in or with a known lawyer before doing anything.",
  },
  {
    id: "sim",
    title: "SIM Card Blocking Threat",
    category: "Government",
    howItWorks:
      "You receive a call claiming to be from TRAI, DoT or your telecom operator saying your SIM will be blocked in two hours because of illegal activity or unverified documents. They ask you to press 9 or share an OTP to keep your number active.",
    redFlags: [
      "Pre-recorded voice followed by a 'customer care' agent",
      "Asks you to press a key or share an OTP",
      "Talks about your number being used for harassment cases",
      "Pretends to forward the call to 'cyber cell'",
    ],
    whatToDo:
      "TRAI never calls customers. If worried, visit your operator's official store with ID. Pressing any number or sharing OTP can let scammers port your SIM.",
  },
  {
    id: "insurance",
    title: "Fake Insurance Renewal Urgency",
    category: "Financial",
    howItWorks:
      "Caller claims your lapsed LIC, health or vehicle insurance can be revived today only with bonus amount of lakhs of rupees. They ask for a small processing fee, GST or stamp duty before the money is released.",
    redFlags: [
      "Promises bonus or maturity amount that is too good to be true",
      "Asks for fees in installments before any payout",
      "Quotes a real old policy number to sound genuine",
      "Pressures you to decide today or lose the money",
    ],
    whatToDo:
      "Call your insurance company on the number printed on your policy document. Never pay processing fees to revive a policy over phone.",
  },
  {
    id: "lottery",
    title: "Lottery Prize Claim Scam",
    category: "Financial",
    howItWorks:
      "An SMS, WhatsApp or call says you have won a KBC lottery, Flipkart lucky draw or Dubai lottery worth twenty five lakh rupees. To release the prize, you must pay tax, courier charges or RBI clearance fee in advance.",
    redFlags: [
      "You won a contest you never entered",
      "Caller claims to be from KBC, Amitabh Bachchan office or RBI",
      "Asks for money to release the prize",
      "Sends a fake cheque image on WhatsApp as proof",
    ],
    whatToDo:
      "Real prizes never need an upfront fee. Block the number, do not reply, and report the message at sancharsaathi.gov.in.",
  },

  // NEW GOVERNMENT SCHEMES & NGO CARDS
  {
    id: "rbi-fraud-framework",
    title: "RBI Small-Value Fraud Framework (2026)",
    category: "Scheme",
    isScheme: true,
    howItWorks:
      "New RBI guidelines to compensate victims of small digital frauds up to ₹25,000. It covers 'no questions asked' minor frauds drawn from the DEA Fund.",
    redFlags: [
      "Covers 85% of the lost amount up to ₹25,000",
      "Applies even if an OTP was accidentally shared",
      "Must be reported within 5 days of the incident",
    ],
    whatToDo:
      "Report fraud to your bank and the 1930 helpline immediately within the 5-day window to claim compensation.",
  },
  {
    id: "it-act-compensation",
    title: "IT Act Statutory Compensation (Sec 43A/46)",
    category: "Scheme",
    isScheme: true,
    howItWorks:
      "Victims of data theft, hacking, or identity fraud can claim up to ₹1 crore from companies or banks whose negligence caused the breach.",
    redFlags: [
      "File cases through the State IT Secretary (Adjudicating Officer)",
      "Mandates damages paid directly to the victim by the company",
      "Applicable for corporate negligence in handling personal data",
    ],
    whatToDo:
      "Consult a cyber lawyer to file an application with the Adjudicating Officer of your state IT department.",
  },
  {
    id: "helpline-1930",
    title: "Citizen Financial Cyber Fraud Reporting (1930)",
    category: "Scheme",
    isScheme: true,
    howItWorks:
      "Immediate relief system that communicates with banks to freeze stolen funds before scammers can withdraw them.",
    redFlags: [
      "Most effective during the 'Golden Hour' (immediately after fraud)",
      "Direct link between police and bank nodal officers",
      "Can retrieve siphoned money if reported fast enough",
    ],
    whatToDo:
      "Call 1930 IMMEDIATELY after losing money. Have your transaction ID and bank details ready.",
  },
  {
    id: "ccpwc-i4c",
    title: "Cyber Prevention Schemes (CCPWC & I4C)",
    category: "Scheme",
    isScheme: true,
    howItWorks:
      "Institutional frameworks (Indian Cybercrime Coordination Centre) that coordinate national anti-fraud efforts and forensic labs.",
    redFlags: [
      "Apex body for coordinating all state cyber cells",
      "Manages the national portal cybercrime.gov.in",
      "Provides grants for specialized cyber forensic labs",
    ],
    whatToDo:
      "Always file your formal complaints at cybercrime.gov.in — it is monitored by I4C at the central level.",
  },
  {
    id: "swachhta-kendra",
    title: "Cyber Swachhta Kendra (Botnet Cleaning)",
    category: "Scheme",
    isScheme: true,
    howItWorks:
      "A free government utility service providing tools to scan and clean malware/botnets from public and private devices.",
    redFlags: [
      "Completely free government security tools",
      "Partners with top antivirus companies for removal tools",
      "Helps prevent your phone from being used by hackers",
    ],
    whatToDo:
      "Visit cyberswachhtakendra.gov.in to download free 'M-Kavach' for mobile or other cleaning tools for your PC.",
  },
  {
    id: "cyber-peace",
    title: "CyberPeace Foundation (Technical NGO)",
    category: "Scheme",
    isScheme: true,
    howItWorks:
      "Global non-profit focusing on internet safety, awareness, and helping victims with technical steps of reporting.",
    redFlags: [
      "Provides free technical support for victims",
      "Focuses on policy advocacy and digital citizenship",
      "Assists in identifying complex phishing patterns",
    ],
    whatToDo:
      "Reach out to CyberPeace via their website for guidance if you are overwhelmed by technical reporting steps.",
  },
  {
    id: "cyber-saathi",
    title: "Cyber Saathi (Legal Aid for Women/Children)",
    category: "Scheme",
    isScheme: true,
    howItWorks:
      "NGO helping women and children facing digital extortion, stalking, or harassment with pro-bono legal guidance.",
    redFlags: [
      "Specialized in harassment and extortion cases",
      "Provides mental health support references",
      "Expert legal guidance for IT Act sections",
    ],
    whatToDo:
      "If facing digital stalking or extortion, visit cybersaathi.org for safe, expert legal paths.",
  },
  {
    id: "nacia-foundation",
    title: "NACIA Foundation (Documentation Help)",
    category: "Scheme",
    isScheme: true,
    howItWorks:
      "Provides access to lawyers who help victims format, document, and file formal cheating and fraud complaints.",
    redFlags: [
      "Helps organize facts for police reports",
      "Assists in documenting evidence correctly",
      "Pro-bono lawyers for cheating/fraud cases",
    ],
    whatToDo:
      "Contact NACIA if you have evidence but don't know how to write a formal legal complaint for the police.",
  },
];
