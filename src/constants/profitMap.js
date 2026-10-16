// Copy and demo data for the Profit Map landing page (/profit-map).
// Source design: Claude Design "Profit Map v36 (Lean, Joseph OS)".

export const DEPTS = [
  {
    key: 'finance',
    label: 'Finance',
    chip: 'Finance',
    n: '4',
    meta: '6 workflows mapped · 1 agent live · last read 2 minutes ago',
    agent: 'Finance Officer',
    price: '$2,400',
    summary:
      'Takes the invoice-to-cash loop off your controller. It reads the inbox, matches documents, drafts what needs sending, and stops at every point where money moves.',
    skills: [
      'Invoice-to-purchase-order matching',
      'Dunning and collections drafts',
      'Bank and ledger reconciliation',
      'Thirteen-week cash forecasting',
    ],
    scope:
      'Runs inside your accounting system and the finance inbox. No new software for the team to learn, no data leaves your tenancy.',
    saving: '≈ 38 hours a week returned',
    human: [
      'Approving any payment or write-off',
      'Signing the month-end close',
      'Anything holding a bank credential',
    ],
    rows: [
      {
        initial: 'IN',
        name: 'invoice intake',
        time: '2m ago',
        status: 'matched 214 invoices to purchase orders, 3 flagged for review',
        state: 'Working',
        tone: 'work',
      },
      {
        initial: 'CO',
        name: 'collections',
        time: '14m ago',
        status: '11 dunning emails drafted, waiting on your approval',
        state: 'Waiting on you',
        tone: 'wait',
      },
      {
        initial: 'MC',
        name: 'month-end close',
        time: '1h ago',
        status: 'reconciled 6 accounts, variance report is on your desk',
        state: 'Done',
        tone: 'done',
      },
      {
        initial: 'CF',
        name: 'cash forecast',
        time: '3h ago',
        status: 'rebuilt the 13-week view from yesterday’s bank feed',
        state: 'Done',
        tone: 'done',
      },
    ],
  },
  {
    key: 'sales',
    label: 'Sales',
    chip: 'Sales',
    n: '5',
    meta: '5 workflows mapped · 1 agent live · last read just now',
    agent: 'Revenue Officer',
    price: '$1,800',
    summary:
      'Handles everything around the conversation so your closers only do the conversation. Scores what comes in, assembles what goes out, keeps the pipeline honest.',
    skills: [
      'Inbound lead scoring and routing',
      'Quote and proposal assembly',
      'CRM deduplication and hygiene',
      'Dormant-pipeline re-activation',
    ],
    scope:
      'Runs inside your CRM and the shared sales mailbox. Nothing reaches a named account without a person reading it first.',
    saving: '≈ 26 hours a week returned',
    human: [
      'Pricing exceptions and discounts',
      'The call itself',
      'Anything sent to a named account unread',
    ],
    rows: [
      {
        initial: 'LT',
        name: 'lead triage',
        time: 'just now',
        status: '89 inbound scored, 12 routed to the closers',
        state: 'Working',
        tone: 'work',
      },
      {
        initial: 'PD',
        name: 'proposal desk',
        time: '22m ago',
        status: '4 quotes built off the pricing sheet, 1 needs a discount call',
        state: 'Waiting on you',
        tone: 'wait',
      },
      {
        initial: 'CH',
        name: 'crm hygiene',
        time: 'overnight',
        status: '340 duplicate records merged, 61 stale deals archived',
        state: 'Done',
        tone: 'done',
      },
      {
        initial: 'FU',
        name: 'follow-up',
        time: '2h ago',
        status: '27 dormant threads reopened with a reason to reply',
        state: 'Done',
        tone: 'done',
      },
    ],
  },
  {
    key: 'people',
    label: 'People',
    chip: 'People',
    n: '3',
    meta: '4 workflows mapped · 1 agent live · last read 5 minutes ago',
    agent: 'People Officer',
    price: '$900',
    summary:
      'Reads every CV against the job description, assembles onboarding, and answers the questions your HR lead answers forty times a month.',
    skills: [
      'CV screening against the job description',
      'Onboarding pack assembly',
      'Policy and leave answers',
      'Interview debrief summaries',
    ],
    scope:
      'Runs inside your ATS and the people inbox. Employee records are read, never written, without a person in the loop.',
    saving: '≈ 31 hours a week returned',
    human: [
      'Every hire and every reject decision',
      'Performance and pay conversations',
      'Anything about a named employee’s record',
    ],
    rows: [
      {
        initial: 'SC',
        name: 'screening',
        time: '5m ago',
        status: '132 CVs read against the JD, 9 shortlisted',
        state: 'Working',
        tone: 'work',
      },
      {
        initial: 'ON',
        name: 'onboarding',
        time: '40m ago',
        status: 'day-one packs sent to 3 new starters',
        state: 'Done',
        tone: 'done',
      },
      {
        initial: 'PL',
        name: 'policy desk',
        time: '1h ago',
        status: '24 leave questions answered, 2 escalated to you',
        state: 'Waiting on you',
        tone: 'wait',
      },
      {
        initial: 'ID',
        name: 'interview notes',
        time: 'yesterday',
        status: '6 debriefs summarised into one scorecard',
        state: 'Done',
        tone: 'done',
      },
    ],
  },
  {
    key: 'legal',
    label: 'Legal',
    chip: 'Legal',
    n: '4',
    meta: '5 workflows mapped · 1 agent live · last read 8 minutes ago',
    agent: 'Contract Officer',
    price: '$3,200',
    summary:
      'Does the first pass on every document so counsel only reads what deviates. Classifies intake, flags clauses, and never renders an opinion.',
    skills: [
      'First-pass contract review',
      'Clause deviation flagging',
      'Renewal and expiry tracking',
      'Request intake and risk routing',
    ],
    scope:
      'Runs against your contract store and the legal intake form. Every flag links back to the clause it came from.',
    saving: '≈ 19 hours a week returned',
    human: [
      'Any legal opinion or sign-off',
      'Negotiation',
      'Anything filed, served or executed',
    ],
    rows: [
      {
        initial: 'CR',
        name: 'contract review',
        time: '8m ago',
        status: '18 NDAs checked, 2 non-standard clauses flagged',
        state: 'Working',
        tone: 'work',
      },
      {
        initial: 'RN',
        name: 'renewals',
        time: '1h ago',
        status: '7 agreements expiring in October surfaced',
        state: 'Waiting on you',
        tone: 'wait',
      },
      {
        initial: 'IK',
        name: 'intake',
        time: '3h ago',
        status: '31 requests classified and routed by risk',
        state: 'Done',
        tone: 'done',
      },
      {
        initial: 'CL',
        name: 'clause library',
        time: 'overnight',
        status: 'updated from last month’s signed agreements',
        state: 'Done',
        tone: 'done',
      },
    ],
  },
  {
    key: 'ops',
    label: 'Operations',
    chip: 'Operations',
    n: '6',
    meta: '8 workflows mapped · 2 agents live · last read 3 minutes ago',
    agent: 'Operations Officer',
    price: '$4,500',
    summary:
      'Reads what comes back from the field and turns it into a schedule. Inspection photos, crew availability, late suppliers, recurring defects.',
    skills: [
      'Inspection report and photo reading',
      'Job sequencing against crew availability',
      'Supplier and delivery chasing',
      'Defect cause grouping',
    ],
    scope:
      'Runs against your field app exports and the operations inbox. Schedules are proposed, never published, without a dispatcher.',
    saving: '≈ 44 hours a week returned',
    human: [
      'Site safety calls',
      'Committing to a customer date',
      'Standing down a crew',
    ],
    rows: [
      {
        initial: 'IR',
        name: 'inspection reports',
        time: '3m ago',
        status: '46 site photos read, 5 defects logged with severity',
        state: 'Working',
        tone: 'work',
      },
      {
        initial: 'SK',
        name: 'scheduling',
        time: '18m ago',
        status: '22 jobs sequenced against crew availability',
        state: 'Working',
        tone: 'work',
      },
      {
        initial: 'SP',
        name: 'supplier chase',
        time: '2h ago',
        status: '9 late deliveries escalated with new dates',
        state: 'Waiting on you',
        tone: 'wait',
      },
      {
        initial: 'QL',
        name: 'quality log',
        time: 'overnight',
        status: 'last week’s defects grouped into 3 recurring causes',
        state: 'Done',
        tone: 'done',
      },
    ],
  },
]

export const TONES = {
  work: { bg: 'rgba(102,102,255,0.16)', fg: '#b6b6ff' },
  wait: { bg: 'rgba(247,144,30,0.14)', fg: '#f7b96a' },
  done: { bg: 'rgba(0,184,176,0.14)', fg: '#4fd6cf' },
}

export const LANES = [
  {
    label: 'Map',
    cols: '1fr 1fr',
    h: '196px',
    steps: [
      {
        num: '01',
        price: 'Free',
        title: 'Profit Map',
        body: 'Joseph reads your company from the outside, then asks three questions. You get the workflow that should move first and what it is costing you now.',
        duration: '20 minutes',
        owner: 'Joseph',
      },
      {
        num: '02',
        price: '$2,500',
        title: 'Process Map',
        body: 'Your leads walk us through the work. We draw it properly, tag every step with time, cost and role, and mark where an agent can stand.',
        duration: '14 days',
        owner: 'Joseph + your leads',
      },
    ],
  },
  {
    label: 'Decide',
    cols: '1fr',
    h: '168px',
    steps: [
      {
        num: '03',
        price: 'Included',
        title: 'The Landmark',
        body: 'One afternoon in a room. We agree what the agent takes, where it stops, who stays accountable, and how we will measure whether the team is better off. Then it is signed.',
        duration: 'One afternoon',
        owner: 'You sign',
      },
    ],
  },
  {
    label: 'Run',
    cols: '1fr 1fr',
    h: '236px',
    steps: [
      {
        num: '04',
        price: '$200–$10K / mo',
        title: 'Agent build',
        body: 'We build inside the systems you already run — your CRM, your ledger, your inbox — and deploy into the workflow we mapped. Priced per agent by complexity, not per seat.',
        duration: '3–6 weeks',
        owner: 'LyRise engineering',
      },
      {
        num: '05',
        price: '3:1 or we stop',
        title: 'Live and measured',
        body: 'The agent runs. We report the financial result against the baseline in the map, plus the joy survey from the Landmark. If it is not returning three for one, we stop charging.',
        duration: 'Ongoing',
        owner: 'Measured monthly',
      },
    ],
  },
]

export const MEASURES = [
  {
    label: 'Productivity',
    body: 'Hours returned per week, counted against the baseline we tagged in your process map — not a vendor estimate.',
  },
  {
    label: 'Profit',
    body: 'Three dollars back for every one you spend. Reported monthly against the same baseline. If it is not there, we stop charging.',
  },
  {
    label: 'Joy',
    body: 'Six questions to the people who do the work, before the agent goes live and again ninety days after. You see both sets of answers.',
  },
]

export const CLAUSES = [
  {
    num: '01',
    title: 'Decisions that stay human',
    body: 'Listed by name, per workflow. If it is not on this list, the agent does not decide it.',
  },
  {
    num: '02',
    title: 'Where the agent stops',
    body: 'The exact step at which it hands the work back, and who it hands it to.',
  },
  {
    num: '03',
    title: 'Who is accountable',
    body: 'One named person on your side and one on ours. Not a team, not a mailbox.',
  },
  {
    num: '04',
    title: 'How we measure joy',
    body: 'The same six questions, before and ninety days after, asked of the people whose work changed.',
  },
]

export const FOOTER = [
  {
    title: 'Product',
    links: ['Joseph', 'Profit Map', 'Process Map', 'The Landmark'],
  },
  {
    title: 'Agents',
    links: [
      'Finance Officer',
      'Revenue Officer',
      'People Officer',
      'Contract Officer',
      'Operations Officer',
    ],
  },
  {
    title: 'Company',
    links: ['About', 'AI talent', 'Case studies', 'Careers'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Trust and security', 'Contact'],
  },
]

export const NAV_LINKS = [
  // The design links "#joseph", which no section defines; the hero is Joseph's.
  { href: '#top', label: 'Joseph' },
  { href: '#sequence', label: 'How it works' },
  { href: '#agents', label: 'Agents' },
  { href: '#landmark', label: 'The Landmark' },
]

export const CONTACT_EMAIL = 'elena@lyrise.ai'
