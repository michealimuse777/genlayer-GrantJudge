## Project Entry: GenLayer Autonomous Grant Evaluator 🏆

**Title**: Autonomous Grant & Bounty Evaluator

**Summary**: A GenLayer Intelligent Contract system that ingests grant proposals and uses embedded multi-reviewer LLM consensus to autonomously score and rank them based on a defined rubric, eliminating manual review bottlenecks.

**Screenshots**: [Insert screenshot links of the NextJS app here]

**Code Repo**: [Insert your GitHub URL here]

**What was achieved**:
- Built a Python Intelligent Contract (`gl.Contract`) storing stateful grant proposals.
- Implemented `gl.llm.complete()` for both single-shot and 3-reviewer consensus scoring.
- Created a sleek Next.js React dashboard for submitting and visualizing the ranked proposals.
- Built an Appeal Workflow allowing submitters to provide context and automatically trigger re-evaluations.

**Next Milestones**:
- Integration with IPFS to handle large PDF grant uploads.
- Expanding the frontend to allow custom dynamic rubric creation natively in the browser.
