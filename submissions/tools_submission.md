## Tool Entry: GenLayer Rubric scoring SDK 🛠

**Title**: `genlayer-rubric` - Scoring & Consensus Adapter

**Overview**:
A reusable Python library designed to simplify prompt generation and multi-agent consensus inside GenVM intelligent contracts.

**Explain Reusable Patterns**:
Instead of hardcoding complex rubrics into your GenLayer contracts, `genlayer-rubric` exposes modular methods like `get_evaluation_prompt` and `calculate_score_average`. This allows developers to pass raw tuples of LLM completions and return safely averaged consensus objects that eliminate LLM variance in smart contract state.

**How others can integrate**:
Copy the `genlayer-rubric/` folder into your GenLayer workspace and import the calculators directly into your `gl.Contract` files to quickly spin up robust decentralized evaluation nodes for reviewing, classifying, or auditing structured text on GenLayer.
