# Components Folder Structure

This directory contains all React components organized by their functional areas based on the navigation menu structure.

## Directory Organization

### `/BASF`
Contains all BASF-specific components:
- **PortfolioOverview.jsx** - Portfolio overview dashboard with savings metrics and opportunity map
- **SixRDisposition.jsx** - 6R disposition analysis and cost breakdown
- **ConfidenceScoring.jsx** - Confidence model with weighted scoring
- **DataPlaybook.jsx** - Data quality and playbook management
- **StakeholderReadiness.jsx** - Stakeholder alignment and readiness matrix

### `/M_M`
Contains all M&M (Manufacturing & Maintenance) components:
- **Reports.jsx** - Analytics and reporting dashboard
- **SmartFactoryChecksheet.jsx** - Digital maturity assessment tool
- **RatingScales.jsx** - Evaluation criteria and scoring systems
- **Matrices.jsx** - Decision and analysis framework matrices

### `/shared`
Contains shared/common components used across multiple features:
- **Sidebar.jsx** - Main navigation sidebar with hierarchical menu
- **Login.jsx** - Authentication component
- **SimulationControls.jsx** - Scenario and sensitivity controls
- **AppDetailOverlay.jsx** - Application detail modal overlay
- **DataEntry.jsx** - Data entry forms and interfaces

### Other Components (root level)
Components that don't fit into the above categories remain at the root level:
- **AppDetailView.jsx**
- **ChangeMgmtView.jsx**
- **DynamicMonteCarlo.jsx**
- **GovernanceView.jsx**
- **SavingsTracker.jsx**

## Import Examples

```javascript
// Import from BASF folder
import { PortfolioOverview, ConfidenceScoring } from './components/BASF';

// Import from M_M folder
import { Reports, Matrices } from './components/M_M';

// Import from shared folder
import { Sidebar, Login } from './components/shared';

// Direct imports (alternative)
import PortfolioOverview from './components/BASF/PortfolioOverview';
import Reports from './components/M_M/Reports';
import Sidebar from './components/shared/Sidebar';
```

## Benefits of This Structure

1. **Modularity**: Components are organized by feature/domain
2. **Maintainability**: Easy to locate and update related components
3. **Scalability**: Simple to add new components to appropriate folders
4. **Clear Separation**: Shared components are clearly distinguished from feature-specific ones
5. **Team Collaboration**: Different teams can work on BASF vs M_M features independently

## Navigation Menu Hierarchy

```
Tech M Digital Cock Pit
├── BASF
│   ├── Portfolio Overview
│   ├── 6R Disposition
│   ├── Confidence Scoring
│   ├── Data Playbook
│   └── Stakeholder Readiness
└── M & M
    ├── Reports
    ├── Smart Factory Checksheet
    ├── Rating Scales
    └── Matrices
```
