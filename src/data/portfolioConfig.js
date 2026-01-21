export const SCENARIOS = {
  Base: { label: 'Base Case', multiplier: 1.0, color: 'text-slate-800', bg: 'bg-slate-100', border: 'border-slate-300', desc: 'Standard risk-adjusted confidence.' },
  Optimistic: { label: 'Optimistic (+15%)', multiplier: 1.15, color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-300', desc: 'Assumes higher realization rate and faster execution.' },
  Conservative: { label: 'Conservative (-20%)', multiplier: 0.8, color: 'text-rose-800', bg: 'bg-rose-50', border: 'border-rose-300', desc: 'Buffers for delays and technical blockers.' }
};

export const READINESS_MAP = {
  Ready: { label: 'Ready', icon: '✅', color: 'bg-emerald-100 text-emerald-800', border: 'border-emerald-200', msg: 'Can move to WP2' },
  Conditional: { label: 'Conditional', icon: '⚠️', color: 'bg-amber-100 text-amber-800', border: 'border-amber-200', msg: 'Needs data / approvals' },
  Blocked: { label: 'Blocked', icon: '⛔', color: 'bg-rose-100 text-rose-800', border: 'border-rose-200', msg: 'Dependencies / regulation' }
};

export const SCORING_LOGIC = {
  dc: { label: 'Data Confidence', question: 'Is cost data complete, validated, traceable?' },
  tf: { label: 'Technical Feasibility', question: 'Is elimination/migration viable today?' },
  dr: { label: 'Dependency Readiness', question: 'Are upstream/downstream dependencies resolvable?' },
  der: { label: 'Decision Readiness', question: 'Is governance authority clear and available?' }
};

export const INITIAL_DATA = {
  stats: { target: 60.0, coverage: { cost: 72, usage: 41, dep: 58 } },
  apps: [
    {
      id: 'A-101',
      name: 'Global SAP ERP',
      segment: 'Finance & GBS',
      gross: 18.5,
      confidence: 85,
      readiness: 'Ready',
      scores: { dc: 90, tf: 85, dr: 80, der: 90 },
      strategy: 'Modernize',
      rationale: {
        driver: 'Operational Efficiency',
        logic: 'Migrate to S/4HANA Cloud to reduce legacy technical debt.',
        alternatives: ['Status Quo', 'Retire'],
        time_quadrant: 'Invest'
      },
      uplift_actions: [],
      imperfections: [],
      stakeholder: { owner: 'Hans M.', group: 'ERP COE', influence: 'High', resistance: 'Low' }
    },
    {
      id: 'A-202',
      name: 'Regional CRM v2',
      segment: 'Sales & Marketing',
      gross: 14.2,
      confidence: 70,
      readiness: 'Conditional',
      scores: { dc: 70, tf: 75, dr: 60, der: 65 },
      strategy: 'Migration',
      rationale: {
        driver: 'Sales Agility',
        logic: 'Consolidate regional instances into global Salesforce tenant.',
        alternatives: ['Upgrade Local', 'Ignore'],
        time_quadrant: 'Migrate'
      },
      uplift_actions: [{ task: 'Confirm user counts via IAM logs', impact: 5, owner: 'IAM Team' }],
      imperfections: ['Inferred user count'],
      stakeholder: { owner: 'Sarah J.', group: 'Sales Ops', influence: 'High', resistance: 'Medium' }
    },
    {
      id: 'A-303',
      name: 'Legacy HR Portal',
      segment: 'HR',
      gross: 12.8,
      confidence: 95,
      readiness: 'Ready',
      scores: { dc: 100, tf: 90, dr: 95, der: 100 },
      strategy: 'Elimination',
      rationale: {
        driver: 'Redundancy',
        logic: 'Functionality fully covered by Workday. Clear retirement path.',
        alternatives: ['Keep as Archive'],
        time_quadrant: 'Eliminate'
      },
      uplift_actions: [],
      imperfections: [],
      stakeholder: { owner: 'Klaus R.', group: 'GBS HR', influence: 'Medium', resistance: 'Low' }
    },
    {
      id: 'A-404',
      name: 'Supply Chain Tracker',
      segment: 'Operations',
      gross: 22.2,
      confidence: 45,
      readiness: 'Blocked',
      scores: { dc: 40, tf: 50, dr: 30, der: 50 },
      strategy: 'Re-platform',
      rationale: {
        driver: 'Infrastructure Risk',
        logic: 'Custom monolith on EOL hardware requires containerization.',
        alternatives: ['Replace', 'Retire'],
        time_quadrant: 'Migrate'
      },
      uplift_actions: [
        { task: 'Validate infra cost allocation', impact: 10, owner: 'Cloud Ops' },
        { task: 'Dependency workshop', impact: 5, owner: 'ERP COE' }
      ],
      imperfections: ['Manual cost tracking'],
      stakeholder: { owner: 'Elena V.', group: 'Logistics IT', influence: 'High', resistance: 'High' }
    },
    {
      id: 'A-505',
      name: 'Plant Maint. App',
      segment: 'Operations',
      gross: 12.1,
      confidence: 55,
      readiness: 'Blocked',
      scores: { dc: 60, tf: 50, dr: 40, der: 60 },
      strategy: 'Re-platform',
      rationale: {
        driver: 'Infrastructure Risk',
        logic: 'Security hole due to OS. Host needs upgrade.',
        alternatives: ['Refactor', 'Eliminate'],
        time_quadrant: 'Migrate'
      },
      uplift_actions: [{ task: 'Technical workshop', impact: 8, owner: 'Security' }],
      imperfections: ['Legacy OS (Win7)'],
      stakeholder: { owner: 'Markus L.', group: 'Plant Ops', influence: 'High', resistance: 'High' }
    }
  ],
  stakeholder_matrix: [
    { group: 'OD Owners', influence: 'High', resistance: 'High', strategy: 'Manage Closely', color: 'bg-rose-500', x: 80, y: 20 },
    { group: 'GD Heads', influence: 'High', resistance: 'Low', strategy: 'Partner/Promote', color: 'bg-emerald-500', x: 80, y: 80 },
    { group: 'App Owners', influence: 'Low', resistance: 'High', strategy: 'Keep Informed', color: 'bg-amber-500', x: 20, y: 20 },
    { group: 'IT Ops', influence: 'Low', resistance: 'Low', strategy: 'Monitor', color: 'bg-slate-600', x: 20, y: 80 }
  ]
};

export const getAdjConf = (base, sens) => Math.max(0, Math.min(100, base + sens));
