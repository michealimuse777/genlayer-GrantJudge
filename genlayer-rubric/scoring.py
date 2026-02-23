from .prompts import get_evaluation_prompt, get_appeal_prompt

def calculate_score_average(scores: list[dict]) -> dict:
    """
    Given a list of JSON score dictionaries from multiple LLM reviewers,
    returns an averaged score object to form consensus.
    """
    if not scores:
        return {}
        
    agregates = {"clarity": 0, "innovation": 0, "feasibility": 0}
    valid_scores = 0
    
    for score in scores:
        try:
            agregates["clarity"] += float(score.get("clarity", 0))
            agregates["innovation"] += float(score.get("innovation", 0))
            agregates["feasibility"] += float(score.get("feasibility", 0))
            valid_scores += 1
        except ValueError:
            pass # Ignore malformed scores
            
    if valid_scores == 0:
        return {"error": "No valid scores to aggregate"}
        
    return {
        "clarity": agregates["clarity"] / valid_scores,
        "innovation": agregates["innovation"] / valid_scores,
        "feasibility": agregates["feasibility"] / valid_scores,
    }

def generate_multi_score_consensus(llm_client, proposal_text: str, num_reviewers: int = 3) -> dict:
    """
    Generates a consensus score by running the prompt multiple times.
    (Note: llm_client would be gl.llm in the contract context, or a mocked client for testing)
    """
    prompt = get_evaluation_prompt(proposal_text)
    scores = []
    
    for _ in range(num_reviewers):
        scores.append(llm_client.complete(prompt))
        
    return calculate_score_average(scores)
