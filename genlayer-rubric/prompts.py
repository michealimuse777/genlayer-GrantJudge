def get_evaluation_prompt(proposal_text: str) -> str:
    """
    Generates the strict evaluation prompt containing the rubric.
    """
    return f"""
    You are an evaluation validator.
    Return STRICT JSON only:
    
    {{
      "clarity": integer 0-10,
      "innovation": integer 0-10,
      "feasibility": integer 0-10,
      "summary": "one sentence explanation"
    }}

    No additional commentary.

    Proposal:
    {proposal_text}
    """

def get_appeal_prompt(proposal_text: str, appeal_text: str) -> str:
    """
    Generates the re-evaluation prompt for a human appeal.
    """
    return f"""
    Re-evaluate this grant proposal considering the author's new appeal context.
    
    Rubric:
    1. Clarity (0-10): How understandable and well-structured is the proposal?
    2. Innovation (0-10): How novel is the approach or technology used?
    3. Feasibility (0-10): How likely is the team to achieve their stated goals within the timeframe?

    Original Proposal:
    {proposal_text}
    
    Appeal / Context:
    {appeal_text}

    You must return ONLY a raw JSON object with the numerical scores.
    Example: '{{"clarity": 8, "innovation": 7, "feasibility": 9}}'
    """
