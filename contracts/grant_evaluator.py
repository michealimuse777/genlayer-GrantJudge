# { "Depends": "py-genlayer:test" }
import json
from dataclasses import dataclass
from genlayer import *

@allow_storage
@dataclass
class Proposal:
    text: str
    author: str
    scores: str
    status: str

class GrantEvaluator(gl.Contract):
    proposals: TreeMap[str, Proposal]
    
    def __init__(self):
        pass

    @gl.public.write
    def submit_proposal(self, proposal_id: str, text: str, author: str):
        if proposal_id in self.proposals:
            raise Exception("Proposal already submitted")
            
        p = Proposal(
            text=text,
            author=author,
            scores="{}",
            status="SUBMITTED"
        )
        self.proposals[proposal_id] = p

    def _execute_llm_evaluation(self, proposal_text: str, appeal: str = "") -> str:
        def get_eval() -> str:
            prompt = f"""
Evaluate this grant proposal.
Text: {proposal_text}
Appeal: {appeal}

Rate Clarity, Innovation, and Feasibility exactly as integers 5, 6, 7, 8, or 9.
You MUST output ONLY a valid JSON dictionary in this exact format, with no extra whitespace:
{{"clarity":7,"feasibility":8,"innovation":6}}
"""
            result = gl.exec_prompt(prompt).replace("```json", "").replace("```", "").strip()
            # Parse and re-dump to ensure perfect string matching across validator consensus
            try:
                parsed = json.loads(result)
                return json.dumps(parsed, separators=(',', ':'), sort_keys=True)
            except Exception:
                return '{"clarity":5,"feasibility":5,"innovation":5}'

        result_json_str = gl.eq_principle_strict_eq(get_eval)
        return result_json_str

    @gl.public.write
    def score_proposal(self, proposal_id: str) -> str:
        if proposal_id not in self.proposals:
            raise Exception("unknown proposal")

        p = self.proposals[proposal_id]
        scores_str = self._execute_llm_evaluation(p.text)
        
        p.scores = scores_str
        p.status = "SCORED"
        
        self.proposals[proposal_id] = p
        return scores_str

    @gl.public.write
    def multi_score(self, proposal_id: str) -> str:
        if proposal_id not in self.proposals:
            raise Exception("unknown proposal")
        
        p = self.proposals[proposal_id]
        scores_str = self._execute_llm_evaluation(p.text)
        
        p.scores = scores_str
        p.status = "MULTI_SCORED"
        
        self.proposals[proposal_id] = p
        return scores_str

    @gl.public.view
    def rank_all(self) -> list:
        all_scores = []
        for p_id, p in self.proposals.items():
            try:
                scores = json.loads(p.scores)
                if isinstance(scores, dict) and "clarity" in scores and "innovation" in scores and "feasibility" in scores:
                    total = float(scores["clarity"]) + float(scores["innovation"]) + float(scores["feasibility"])
                    all_scores.append({
                        "proposal_id": p_id,
                        "author": p.author,
                        "total_score": total,
                        "scores": scores,
                        "status": p.status
                    })
            except Exception:
                continue
        
        return sorted(all_scores, key=lambda x: x["total_score"], reverse=True)
        
    @gl.public.write
    def appeal_proposal(self, proposal_id: str, appeal_text: str) -> str:
        if proposal_id not in self.proposals:
            raise Exception("unknown proposal")

        p = self.proposals[proposal_id]
        scores_str = self._execute_llm_evaluation(p.text, appeal_text)
        
        p.scores = scores_str
        p.status = "APPEALED_AND_RESCORED"
        
        self.proposals[proposal_id] = p
        return scores_str
