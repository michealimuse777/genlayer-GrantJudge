# GenLayer Autonomous Grant Evaluator

An autonomous, Intelligent Contract-powered grant and bounty evaluator built on GenLayer for the February hackathon sprint. 

This project evaluates grant proposals by ingesting text, scoring them across a multi-reviewer LLM consensus rubric, and ranking proposals automatically without human bias, leveraging GenLayer's built-in `gl.llm` capabilities.

## Architecture
1. **Intelligent Contract (`contracts/grant_evaluator.py`)**: Stores proposals, performs LLM evaluations, manages consensus scoring, and handles appeals.
2. **Next.js Frontend (`frontend/`)**: A sleek dashboard to submit and view evaluated proposals, communicating via GenLayerJS.
3. **Rubric Tools (`genlayer-rubric/`)**: Reusable Python libraries for prompt generation and score pooling.

## Quick Start Pipeline

### 1. Contract Deployment
Deploy the `contracts/grant_evaluator.py` to GenLayer DevNet/TestNet using the GenLayer Studio or CLI.

### 2. Frontend
Navigate into the frontend folder and run the Next.js React app:
```bash
cd frontend
npm install
npm run dev
```

### 3. Usage
- Provide a `proposal_id` and proposal text on the frontend.
- Submit the evaluation (calls `submit_proposal`).
- Manually trigger `multi_score` via the contract dashboard to run the multi-reviewer consensus.
- View ranked consensus on the Next.js dashboard by hitting **Fetch Network Consensus**.
