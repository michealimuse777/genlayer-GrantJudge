## Documentation Entry: Building an AI-Evaluator

**Topic**: How to build an Autonomous Evaluator using GenLayer Intelligent Contracts

**Overview**:
This guide demonstrates the architecture required to build a multi-reviewer AI evaluator on GenVM. 

**Rubric Best Practices**:
When using `gl.llm.complete()` for structured scoring, always constrain your prompt to return a machine-readable JSON object.
```python
prompt = f"""
Evaluate this text against the rubric:
1. Clarity (0-10)
2. Innovation (0-10)
Returns ONLY JSON: '{{"clarity": #, "innovation": #}}'
"""
results = gl.llm.complete(prompt)
```

**Gotchas & Tips**:
- The GenLayer SDK requires strict type hints for state variables. Always define module-level type hints (e.g. `proposals: dict`) inside your class before the `__init__` constructor.
- When generating consensus loops (e.g. 3 reviewers), handle potential missing keys from LLM hallucinations safely using `.get("key", 0)` to prevent contract exceptions during state updates.
