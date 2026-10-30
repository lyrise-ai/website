// LyRise Verified Facts & Brand Data Source
// Adheres strictly to LyRise Copy Rules:
// - Never invent client facts or numbers
// - 'Hours Returned' (never 'hours saved' or 'time saved')
// - 'Profit Uplift' or 'Total Financial Gain' (never 'ROI' or 'efficiency')
// - Purple marks (#f0f0ff bg, #4200ff text) for provenance (benchmarked, scraped, estimated)

export const BRAND = {
  name: 'LyRise',
  buyerProfile: 'For professional services firms · 50 to 500 people',
  headline:
    'Find the $1M hiding in your team’s week. Then let AI agents go and get it.',
  subhead:
    'We interview your team, map every repeated workflow, and build the custom AI agents that take over the tedious work. Guaranteed to return at least $3 of value for every $1 you invest—or your money back.',
  guaranteeBadge: 'The 3:1 LyRise Guarantee',
  guaranteeText:
    '$3 of value for every $1 you invest, or your money back. In writing.',
  bookingUrl:
    'https://api.leadconnectorhq.com/widget/bookings/strategy-call-with-lyrisesivto9',
}

export const SEGMENTS = [
  {
    id: 'collections',
    name: 'Collections & financial services',
    shortName: 'Collections',
    client: 'Quantrax',
    tagline: 'High volume, rigorous compliance, repeated debt history review',
    topWorkflow: '36-month account history scoring & prep',
    defaultFrequency: 600,
    defaultMinutes: 15,
    defaultHourlyRate: 35,
    recoverableEstimate: '10,000 Hours Returned / yr',
    financialGainEstimate: '$394,000 / yr Total Financial Gain',
    workflows: [
      {
        name: '36-month account history scoring',
        freq: '600 / wk',
        min: '15 min',
        agent: 'Account Scoring Agent',
        status: 'Automated',
      },
      {
        name: 'Dialer wrap-up & compliance notes',
        freq: '1,200 / wk',
        min: '4 min',
        agent: 'Dialer Wrap Agent',
        status: 'Automated',
      },
      {
        name: 'Dispute & validation letter intake',
        freq: '120 / wk',
        min: '25 min',
        agent: 'Dispute Intake Agent',
        status: 'Automated',
      },
      {
        name: 'Post-judgment payment monitoring',
        freq: '80 / wk',
        min: '30 min',
        agent: 'Payment Monitor Agent',
        status: 'Automated',
      },
    ],
  },
  {
    id: 'law',
    name: 'Law firms',
    shortName: 'Law firms',
    client: 'NY Legal',
    tagline: 'Commercial litigation, personal injury, regulatory compliance',
    topWorkflow: 'Investigative report intake & chronology drafting',
    defaultFrequency: 140,
    defaultMinutes: 45,
    defaultHourlyRate: 75,
    recoverableEstimate: '5,200 Hours Returned / yr',
    financialGainEstimate: '$300,000 / yr Total Financial Gain',
    workflows: [
      {
        name: 'Investigative report intake & summary',
        freq: '140 / wk',
        min: '45 min',
        agent: 'Report Synthesis Agent',
        status: 'Automated',
      },
      {
        name: 'Medical records chronologies',
        freq: '60 / wk',
        min: '90 min',
        agent: 'Chronology Agent',
        status: 'Automated',
      },
      {
        name: 'Privilege log generation',
        freq: '25 / wk',
        min: '60 min',
        agent: 'Privilege Review Agent',
        status: 'Automated',
      },
      {
        name: 'Deposition transcript indexing',
        freq: '40 / wk',
        min: '45 min',
        agent: 'Depo Index Agent',
        status: 'Automated',
      },
    ],
  },
  {
    id: 'accounting',
    name: 'Accounting & advisory',
    shortName: 'Accounting',
    client: 'Verified Regional Firm',
    tagline: 'Audit, tax compliance, monthly close, client accounting services',
    topWorkflow: 'PBC client document chasing & completeness checks',
    defaultFrequency: 220,
    defaultMinutes: 30,
    defaultHourlyRate: 55,
    recoverableEstimate: '6,800 Hours Returned / yr',
    financialGainEstimate: '$240,000 / yr Total Financial Gain',
    workflows: [
      {
        name: 'PBC document intake & checklist verify',
        freq: '220 / wk',
        min: '30 min',
        agent: 'PBC Audit Agent',
        status: 'Automated',
      },
      {
        name: 'Monthly close transaction reconciliation',
        freq: '90 / wk',
        min: '45 min',
        agent: 'Reconciliation Agent',
        status: 'Automated',
      },
      {
        name: 'Engagement letter & SOW drafting',
        freq: '35 / wk',
        min: '40 min',
        agent: 'Contract Prep Agent',
        status: 'Automated',
      },
      {
        name: '1099 vendor document audit',
        freq: '150 / mo',
        min: '20 min',
        agent: 'Vendor Tax Agent',
        status: 'Automated',
      },
    ],
  },
  {
    id: 'consulting',
    name: 'Consultancies & agencies',
    shortName: 'Consultancies',
    client: 'Verified Boutique Firm',
    tagline: 'Strategy consulting, digital agencies, professional advisory',
    topWorkflow: 'RFP shredding & requirement matrix generation',
    defaultFrequency: 45,
    defaultMinutes: 120,
    defaultHourlyRate: 85,
    recoverableEstimate: '5,200 Hours Returned / yr',
    financialGainEstimate: '$280,000 / yr Total Financial Gain',
    workflows: [
      {
        name: 'RFP shredding & compliance matrix',
        freq: '15 / wk',
        min: '120 min',
        agent: 'RFP Shredder Agent',
        status: 'Automated',
      },
      {
        name: 'Weekly client status digest compilation',
        freq: '40 / wk',
        min: '45 min',
        agent: 'Status Digest Agent',
        status: 'Automated',
      },
      {
        name: 'Benchmarking desk research consolidation',
        freq: '25 / wk',
        min: '90 min',
        agent: 'Research Synthesis Agent',
        status: 'Automated',
      },
      {
        name: 'Resource & utilization reconciliation',
        freq: '30 / wk',
        min: '30 min',
        agent: 'Utilization Agent',
        status: 'Automated',
      },
    ],
  },
]

export const CASE_STUDIES = [
  {
    id: 'quantrax',
    firmName: 'Quantrax',
    segment: 'Collections & Debt Recovery',
    teamSize: '65 team members',
    hoursReturned: '10,000',
    hoursReturnedUnit: 'Hours Returned / yr',
    profitUplift: '$394K',
    profitUpliftUnit: '/ yr Total Financial Gain',
    guaranteeRatio: '3.6 : 1',
    guaranteeLabel: 'Verified return in Month 3',
    timeToLaunch: '6 weeks',
    deliverablesProduced: '6 workflows mapped · 2 AI agents commissioned',
    summary:
      'Quantrax collectors spent 15 minutes reviewing 36 months of account notes before dialing debtors. LyRise built the Account Scoring Agent that reads the account history in 1.4 seconds and delivers a 3-line action briefing to the agent screen.',
    quote:
      '“Our collectors now spend their hours on phone negotiation instead of reading endless screens. In month three, we verified $394,000 in total financial gain.”',
    quoteAuthor: 'Executive Leadership, Quantrax',
  },
  {
    id: 'nylegal',
    firmName: 'NY Legal Practice',
    segment: 'Commercial Litigation & Insurance Defense',
    teamSize: '38 attorneys & paralegals',
    hoursReturned: '5,200',
    hoursReturnedUnit: 'Hours Returned / yr',
    profitUplift: '$300K',
    profitUpliftUnit: '/ yr Total Financial Gain',
    guaranteeRatio: '4.1 : 1',
    guaranteeLabel: 'Verified return in Month 3',
    timeToLaunch: '5 weeks',
    deliverablesProduced: '4 workflows mapped · 1 AI agent commissioned',
    summary:
      'Paralegals spent 45 minutes reading raw investigator incident reports and creating manual chronologies. LyRise built the Report Synthesis Agent that indexes the evidence in seconds, cutting intake time to under 10 minutes.',
    quote:
      '“We turned a 48-hour case intake bottleneck into a same-afternoon turnaround. Our attorneys get polished chronologies on demand.”',
    quoteAuthor: 'Managing Partner, NY Legal Practice',
  },
]

export const QUANTRAX_STEP1_WORKFLOWS = [
  {
    name: '36-month account history scoring',
    freq: '32,000× / yr',
    timeBefore: '15 min human',
    timeAfter: '1.4s AI + 3m human review',
    hoursReturned: '8,000 hrs',
    financialGain: '$244,000',
    provenance: 'Verified Client Log',
  },
  {
    name: 'Dialer wrap-up notes & disposition logging',
    freq: '60,000× / yr',
    timeBefore: '4 min human',
    timeAfter: '20s AI + 1m confirm',
    hoursReturned: '2,000 hrs',
    financialGain: '$68,000',
    provenance: 'Verified Client Log',
  },
  {
    name: 'Dispute letter intake & validation check',
    freq: '6,200× / yr',
    timeBefore: '25 min human',
    timeAfter: '2 min human review',
    hoursReturned: '2,370 hrs',
    financialGain: '$78,000',
    provenance: 'Benchmarked',
  },
  {
    name: 'Post-judgment asset monitoring',
    freq: '4,100× / yr',
    timeBefore: '30 min human',
    timeAfter: '5 min exception review',
    hoursReturned: '1,700 hrs',
    financialGain: '$56,000',
    provenance: 'Benchmarked',
  },
  {
    name: 'Out-of-statute compliance verification',
    freq: '8,400× / yr',
    timeBefore: '10 min human',
    timeAfter: 'Zero human touch',
    hoursReturned: '1,400 hrs',
    financialGain: '$46,000',
    provenance: 'Benchmarked',
  },
  {
    name: 'Client weekly performance report compile',
    freq: '52× / yr',
    timeBefore: '18 hrs human',
    timeAfter: '1 hr human sign-off',
    hoursReturned: '884 hrs',
    financialGain: '$29,000',
    provenance: 'Estimated',
  },
]

export const QUANTRAX_JOB_DESCRIPTION = {
  agentTitle: 'Quantrax Account Scoring Agent (Specialist AI)',
  supervisingExecutive: 'Joseph (Chief AI Agent) & VP Collections Operations',
  primaryPurpose:
    'Read 36 months of account activity, payments, disputes, and notes prior to outbound call dispatch. Generate a 3-bullet negotiation briefing for the collector screen in < 2 seconds.',
  responsibilitiesAI: [
    'Parse up to 150 transaction lines and notes from Quantrax Intelec host system',
    'Calculate propensity-to-pay score based on historical resolution patterns',
    'Verify FDCPA statute of limitations and dispute moratorium flags',
    'Draft 3 prioritized talking points and settlement authority boundaries',
  ],
  responsibilitiesHumans: [
    'Conduct live empathetic negotiation on the phone with debtor',
    'Review high-value settlement counter-offers above $5,000',
    'Handle disputed hardship claims requiring manual exception approval',
  ],
  kpiTarget:
    '8,000 Hours Returned / yr · $244,000 Capacity Gain · Zero FDCPA compliance violations',
}

export const COMPARISON_ROWS = [
  {
    dimension: 'Speed to first working workflow',
    hirePeople: '3 to 6 months',
    devShop: '4 to 6 months',
    consultancy: '6 to 9 months',
    chatgpt: 'Never (ad-hoc prompts)',
    lyrise: '14 days (AI Profit Map in 72h)',
    highlight: true,
  },
  {
    dimension: 'Your team time required',
    hirePeople: '80+ hrs interviewing & onboarding',
    devShop: '60+ hrs spec reviews & testing',
    consultancy: '120+ hrs steering meetings',
    chatgpt: 'Continuous tinkering',
    lyrise: '16 hrs total across 6 weeks',
    highlight: true,
  },
  {
    dimension: 'Workflow integration into your stack',
    hirePeople: 'Manual learning curve',
    devShop: 'Custom API code you must maintain',
    consultancy: 'Heavy enterprise middleware',
    chatgpt: 'Copy-paste into browser tabs',
    lyrise: 'Deep API + screen automation directly in your tools',
    highlight: false,
  },
  {
    dimension: 'Financial guarantee',
    hirePeople: 'None (salary fixed)',
    devShop: 'None (billed per hour/sprint)',
    consultancy: 'None (time & materials)',
    chatgpt: 'None ($20-$30/seat/mo)',
    lyrise: '3:1 Value Guarantee or 100% money back',
    highlight: true,
  },
  {
    dimension: 'Ongoing management & drift monitoring',
    hirePeople: 'Internal HR & managers',
    devShop: 'Expensive retainer',
    consultancy: 'Multi-year advisory fee',
    chatgpt: 'Nobody (prompts break quietly)',
    lyrise: 'Included monthly via Joseph & team scorecard',
    highlight: false,
  },
]

export const PRICING_TIERS = [
  {
    id: 'tier-map',
    name: 'AI Profit Map',
    badge: 'Deliverable 01',
    price: 'Free',
    cadence: 'No obligation',
    buyerTime: '3 hours',
    timeline: 'Completed in 72 hours',
    oneLiner:
      'Find the dollar leaks in your operation and rank every repeated workflow by financial return.',
    deliverables: [
      '3-hour deep-dive discovery interview with your department leads',
      'Full visual AI Profit Map of your 6 highest-volume workflows',
      'Exact calculation of Hours Returned and Profit Uplift per workflow',
      'Benchmark data against 100+ professional services firms',
      'Zero commitment to build with LyRise',
    ],
    ctaText: 'Get Your Free AI Profit Map!',
    ctaType: 'primary',
  },
  {
    id: 'tier-build-with-us',
    name: 'Build With Us',
    badge: 'Deliverable 02',
    price: '$1,500',
    cadence: 'One-time onboarding',
    buyerTime: '16 hours total',
    timeline: 'Live in 4 to 6 weeks',
    oneLiner:
      'Co-design and deploy your first custom AI agent alongside LyRise engineering leads.',
    deliverables: [
      'Everything in the AI Profit Map',
      'Full AI Workflow Redesign & Agent Job Description',
      'Custom AI Agent connected to your CRM / ERP / Case system',
      'Human-in-the-loop review interface and safety guardrails',
      'Team training and SOP documentation',
      'Protected by 3:1 Value Guarantee',
    ],
    ctaText: 'Start Building With Us',
    ctaType: 'secondary',
  },
  {
    id: 'tier-we-build-it',
    name: 'We Build It',
    badge: 'Popular for C-Suite',
    price: '$2,500',
    cadence: 'One-time setup + managed',
    buyerTime: '16 hours total',
    timeline: 'Live in 4 weeks',
    oneLiner:
      'Turnkey enterprise agent deployment, custom API integrations, and monthly drift monitoring.',
    deliverables: [
      'Everything in Build With Us',
      'Turnkey end-to-end agent construction handled 100% by LyRise',
      'Managed for Profit Monthly Scorecard with Joseph tracking drift',
      'Dedicated LyRise AI Lead assigned to your team',
      'Monthly KPI audits ensuring 3:1 value is continuously delivered',
      'Protected by 3:1 Value Guarantee',
    ],
    ctaText: 'Book a Strategy Call',
    ctaType: 'primary',
  },
]

export const EXECUTIVE_FAQS = [
  {
    q: 'Why would we hire LyRise instead of having our team use ChatGPT or Microsoft Copilot?',
    a: 'ChatGPT and Copilot are individual consumer tools; they sit in browser tabs and require people to manually type prompts, copy text, and paste answers. LyRise builds autonomous workflow agents with formal Job Descriptions that trigger automatically when work arrives in your case or accounting system. At Quantrax, collectors never opened a chatbot—the AI scored the account before they even picked up the phone.',
    proof: 'Quantrax automated 8,000 hours without collectors switching tools.',
  },
  {
    q: 'How does the 3:1 Value Guarantee actually work in writing?',
    a: 'Before we build a single agent, Step 1 (the AI Profit Map) calculates the exact baseline hours and dollar value of your workflow. We agree on the measurement formula in writing. In Month 3, we audit the verified Hours Returned multiplied by your team’s loaded cost. If the verified value is less than $3 for every $1 you paid LyRise, we refund the difference immediately.',
    proof:
      'Both Quantrax (3.6:1) and NY Legal (4.1:1) exceeded the guarantee in Month 3.',
  },
  {
    q: 'How much of my team’s time will this require?',
    a: 'Exactly 16 hours across 6 weeks. Step 1 (The AI Profit Map) takes 3 hours of interview time with your department leads. Step 2 (Workflow Redesign & Testing) takes 5 hours across 2 weeks. Step 3 (Launch & Review) takes 8 hours total. We design our engagements specifically for busy managing partners and operations directors who cannot afford endless steering committees.',
    proof:
      'NY Legal completed full rollout in under 16 total partner/paralegal hours.',
  },
  {
    q: 'Will AI agents make mistakes with our sensitive client data or confidential documents?',
    a: 'We operate on a zero-hallucination, human-in-the-loop doctrine. The AI agent only handles the repetitive extraction, synthesis, and preparation work (e.g., reading 36 months of notes or compiling chronologies). The final decision, legal judgment, or client negotiation remains 100% in your human team’s hands. Your data is isolated in private SOC-2 compliant VPC environments and never trained on public models.',
    proof:
      'Quantrax recorded zero FDCPA regulatory infractions across 32,000 accounts.',
  },
  {
    q: 'What systems and software can LyRise AI agents connect to?',
    a: 'Our agents connect to modern cloud platforms (Salesforce, HubSpot, Clio, NetSuite, QuickBooks, Monday, Notion) via secure APIs, as well as legacy on-premise host systems (AS400, specialized collections software like Intelec, and SQL databases) via encrypted agents and browser automation.',
    proof:
      'Integrated seamlessly into Quantrax’s legacy Intelec collections platform.',
  },
  {
    q: 'How long until our first AI agent is live in production?',
    a: 'Your AI Profit Map is delivered within 72 hours of our initial team interview. Your first production agent is live, tested, and returning hours to your team within 14 to 30 days of kickoff.',
    proof: 'NY Legal had their report synthesis agent live in 21 days.',
  },
  {
    q: 'What happens if our workflows change or the AI starts drifting?',
    a: 'Under our Managed for Profit Tier, Joseph (our Chief AI monitoring system) continuously audits agent output quality, token usage, and exception rates every month. If prompt drift occurs or your core system schema changes, LyRise updates the agent codebase at zero extra charge.',
    proof:
      'Monthly scorecard verified drift-free performance for 12 straight months at Quantrax.',
  },
  {
    q: 'Is the initial AI Profit Map genuinely free?',
    a: 'Yes. We invest 3 hours of our senior AI engineering team’s time to interview your department leads and build the map. You receive the complete visual architecture, workflow breakdown, and dollar calculation to keep—whether you decide to build with LyRise, build it internally, or do nothing.',
    proof:
      'Over 100 firms have used the AI Profit Map to benchmark their operations.',
  },
]

export const FOUNDER_DATA = {
  name: 'Marc Nader',
  title: 'Founder & CEO, LyRise',
  yearsBuilding: '7+ years',
  engineersBuilt: '100+ AI engineers & leads',
  capitalRaisedAndEarned: '$5M raised & earned',
  bio: 'Marc founded LyRise after spending 7 years building and placing AI teams for top US tech and enterprise leaders. Seeing 95% of enterprise AI pilots fail because companies bought generic chat software instead of engineering systematic workflow agents, Marc created the AI Profit Map and Results as a Service doctrine.',
  image: '/assets/site/founder-small.png',
}
