# GrantJudge — Autonomous Grant Evaluator on GenLayer

> An Intelligent Contract-powered proposal evaluation system built on GenLayer's StudioNet blockchain. Proposals are submitted, scored via consensus-validated rubrics, and ranked — all on-chain, without human bias.

**Live Demo:** [genlayer-grant-judge.vercel.app](https://genlayer-grant-judge.vercel.app)  
**Contract Address:** `0x55332F18b8c864CDd24EC6F7277c3bB416C0ee85` (StudioNet)  
**GitHub:** [michealimuse777/genlayer-GrantJudge](https://github.com/michealimuse777/genlayer-GrantJudge)

---

## What It Does

GrantJudge allows DAOs and organizations to evaluate grant proposals transparently:

1. **Submit** a proposal with an ID and detailed text
2. **Score** the proposal — triggers on-chain evaluation across 5 validator nodes
3. **Rank** all proposals by aggregate score on a real-time leaderboard
4. **Appeal** any score with additional justification for re-evaluation

Every step is recorded immutably on GenLayer's StudioNet blockchain with multi-validator consensus.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Next.js Frontend                   │
│         (React + genlayer-js SDK)                   │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Proposal │  │  Evaluation  │  │   Ranked     │  │
│  │ Composer │  │  Timeline    │  │   Results    │  │
│  └──────────┘  └──────────────┘  └──────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │ writeContract / readContract
                     ▼
┌─────────────────────────────────────────────────────┐
│           GenLayer StudioNet Blockchain              │
│  ┌───────────────────────────────────────────────┐  │
│  │       GrantEvaluator (Intelligent Contract)    │  │
│  │                                               │  │
│  │  submit_proposal()  →  Stores on-chain        │  │
│  │  multi_score()      →  Deterministic scoring  │  │
│  │  rank_all()         →  Sorted leaderboard     │  │
│  │  appeal_proposal()  →  Re-evaluation          │  │
│  │                                               │  │
│  │  Storage: TreeMap[str, Proposal]              │  │
│  │  Consensus: gl.eq_principle.strict_eq          │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  Validated by 5 heterogeneous AI model nodes:       │
│  GPT-5.1 · Gemini-3 · Claude-Sonnet-4.5            │
│  Grok-4 · Llama-4-Maverick                          │
└─────────────────────────────────────────────────────┘
```

---

## Scoring System

Proposals are evaluated across three dimensions with a deterministic text-analysis algorithm:

| Dimension | Range | What It Measures |
|-----------|-------|-----------------|
| **Clarity** | 3–10 | Word count, sentence structure, descriptive keywords ("build", "create", "implement"), goal-oriented language |
| **Innovation** | 2–10 | Technical terms ("AI", "blockchain", "smart contract"), novelty markers ("novel", "unique"), depth indicators |
| **Feasibility** | 3–10 | Planning keywords ("MVP", "milestone", "timeline"), experience markers ("deployed", "tested"), actionable scope |

**Total Score** = Clarity + Innovation + Feasibility (max 30)

The scoring function runs inside `gl.eq_principle.strict_eq`, meaning all 5 validator nodes independently execute the same function and must produce **identical results** before the score is committed to the blockchain.

### Why Deterministic (Not AI)?

GenLayer's `gl.exec_prompt` (the LLM evaluation API) is currently non-functional inside equivalence principle blocks on StudioNet. We exhaustively tested every available consensus method:

- `gl.eq_principle.strict_eq` — validators disagree on LLM outputs
- `gl.eq_principle.prompt_comparative` — crashes internally on StudioNet
- `gl.eq_principle.prompt_non_comparative` — argument signature mismatch

The 5 validator nodes each use a **different AI model** (GPT-5.1, Gemini, Claude, Grok, Llama), making it fundamentally impossible for them to produce identical AI-generated text. The deterministic scorer ensures reliable consensus while maintaining meaningful, varied evaluation scores.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Python (GenLayer Intelligent Contract) |
| Blockchain | GenLayer StudioNet |
| Frontend | Next.js 14 + React + TypeScript |
| Styling | Tailwind CSS + custom dark theme |
| SDK | `genlayer-js` (browser client) |
| Deployment | Vercel (frontend) + GenLayer StudioNet (contract) |

---

## Project Structure

```
genlayer-grant-evaluator/
├── contracts/
│   ├── grant_evaluator.py     # Main Intelligent Contract
│   └── inspector.py           # Debug/test contract
├── frontend/
│   ├── components/
│   │   ├── AppShell.tsx        # Layout wrapper with dark theme
│   │   ├── ProposalComposer.tsx # Proposal submission form
│   │   ├── EvaluationTimeline.tsx # Real-time progress steps
│   │   └── RankedResults.tsx   # Ranked leaderboard display
│   ├── pages/
│   │   ├── index.tsx           # Main page with all logic
│   │   └── _app.tsx            # App wrapper
│   ├── styles/
│   │   └── globals.css         # Global styles + Tailwind
│   └── package.json
├── genlayer-rubric/
│   ├── prompts.py              # Prompt templates
│   └── scoring.py              # Score aggregation utilities
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- GenLayer CLI (`npm install -g genlayer`)

### 1. Clone & Install

```bash
git clone https://github.com/michealimuse777/genlayer-GrantJudge.git
cd genlayer-GrantJudge/frontend
npm install
```

### 2. Run Locally

```bash
npm run dev
```

Open [http://localhost:3006](http://localhost:3006) in your browser.

### 3. Deploy Contract (Optional)

If you want to deploy your own instance:

```bash
cd ..
genlayer deploy --contract contracts/grant_evaluator.py
```

Update the `CONTRACT_ADDRESS` in `frontend/pages/index.tsx` with your new address.

---

## How It Works (Step by Step)

### Submitting a Proposal
1. Enter a **Proposal ID** (e.g., "PR-001") and detailed **proposal text**
2. Click **Submit for Evaluation**
3. The frontend calls `writeContract("submit_proposal", [id, text, author])`
4. 5 validator nodes verify the transaction → `MAJORITY_AGREE` → stored on-chain

### Scoring a Proposal
1. After submission, the frontend automatically calls `writeContract("multi_score", [id], { leaderOnly: true })`
2. The contract's `_execute_llm_evaluation()` runs inside `gl.eq_principle.strict_eq`
3. The deterministic scorer analyzes word count, keywords, and structure
4. All validators produce identical scores → consensus achieved → scores saved

### Viewing Rankings
1. Click **Sync Ledgers** on the dashboard
2. The frontend calls `readContract("rank_all")`
3. All proposals are returned sorted by total score (descending)
4. Each proposal shows clarity, innovation, feasibility breakdowns

---

## Smart Contract API

### Write Methods

| Method | Arguments | Description |
|--------|-----------|-------------|
| `submit_proposal` | `proposal_id: str, text: str, author: str` | Submit a new proposal |
| `multi_score` | `proposal_id: str` | Trigger consensus-validated scoring |
| `score_proposal` | `proposal_id: str` | Single-pass scoring |
| `appeal_proposal` | `proposal_id: str, appeal_text: str` | Re-evaluate with appeal justification |

### Read Methods

| Method | Arguments | Returns |
|--------|-----------|---------|
| `rank_all` | None | JSON array of all proposals sorted by score |

### Example Response (`rank_all`)

```json
[
  {
    "proposal_id": "PR-001",
    "author": "0xUserDemo",
    "total_score": 21.0,
    "scores": {
      "clarity": 8,
      "innovation": 7,
      "feasibility": 6,
      "summary": "Evaluated based on 42 words with keyword analysis"
    },
    "status": "MULTI_SCORED"
  }
]
```

---

## Deployment

### Frontend (Vercel)

The frontend is deployed on Vercel for instant global access:

```bash
cd frontend
npx vercel --prod
```

### Contract (StudioNet)

The contract is deployed on GenLayer StudioNet:
- **Address:** `0x55332F18b8c864CDd24EC6F7277c3bB416C0ee85`
- **Network:** GenLayer StudioNet (`https://studio.genlayer.com/api`)

---

## Development Log

### Contracts Deployed (Chronological)

| Address | Version | Status |
|---------|---------|--------|
| `0xaCdd...` | Initial `prompt_non_comparative` | ❌ TypeError |
| `0xe5C0...` | Fixed kwargs | ❌ DISAGREE |
| `0xB8e6...` | Binary yes/no with `strict_eq` | ❌ DISAGREE |
| `0x4CF2...` | Inspector (`prompt_comparative` test) | ❌ DISAGREE |
| `0x1179...` | Direct `exec_prompt` (no wrapper) | ❌ Silent fail |
| `0xF3fF...` | `prompt_comparative` + `leaderOnly` | ❌ Crashes |
| `0xeC57...` | `strict_eq` + LLM | ❌ `exec_prompt` crashes |
| `0xF098...` | Hardcoded scores + `strict_eq` | ✅ **24.0 score** |
| `0x5533...` | Deterministic scorer + `strict_eq` | ✅ **Production** |

---

## License

MIT
