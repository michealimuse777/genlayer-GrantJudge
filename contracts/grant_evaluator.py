# { "Depends": "py-genlayer:test" }
from genlayer import *

class GrantEvaluator(gl.Contract):
    proposals: dict
    
    def __init__(self):
        self.proposals = {}

    @gl.public.write
    def submit_proposal(self, proposal_id: str, text: str, author: str):
        self.proposals[proposal_id] = {
            "text": text,
            "author": author,
            "scores": {},
            "status": "SUBMITTED"
        }

    @gl.public.write
    def score_proposal(self, proposal_id: str) -> dict:
        contract_data = self.proposals.get(proposal_id)
        if not contract_data:
            return {"error": "unknown proposal"}

        prompt = f"""
        Evaluate this grant proposal with rubric:
        1. Clarity 0-10
        2. Innovation 0-10
        3. Feasibility 0-10

        Proposal:
        {contract_data["text"]}

        Return a JSON: '{{"clarity": #, "innovation": #, "feasibility": #}}'
        """
        results = gl.llm.complete(prompt)

        self.proposals[proposal_id]["scores"] = results
        self.proposals[proposal_id]["status"] = "SCORED"

        return results

    @gl.public.write
    def multi_score(self, proposal_id: str) -> dict:
        contract_data = self.proposals.get(proposal_id)
        if not contract_data:
            return {"error": "unknown proposal"}

        prompt = f"""
        Evaluate this grant proposal with rubric:
        1. Clarity 0-10
        2. Innovation 0-10
        3. Feasibility 0-10

        Proposal:
        {contract_data["text"]}

        Return a JSON: '{{"clarity": #, "innovation": #, "feasibility": #}}'
        """
        scores = []
        for _ in range(3):
            scores.append(gl.llm.complete(prompt))
        
        try:
            avg_scores = {
                "clarity": sum(s.get("clarity", 0) for s in scores) / len(scores),
                "innovation": sum(s.get("innovation", 0) for s in scores) / len(scores),
                "feasibility": sum(s.get("feasibility", 0) for s in scores) / len(scores),
            }
        except Exception:
            avg_scores = {"error": "parsing error during consensus"}

        self.proposals[proposal_id]["scores"] = avg_scores
        self.proposals[proposal_id]["status"] = "MULTI_SCORED"

        return avg_scores

    @gl.public.view
    def rank_all(self) -> list:
        all_scores = []
        for p_id in self.proposals:
            p = self.proposals[p_id]
            scores = p.get("scores", {})
            if isinstance(scores, dict) and "clarity" in scores and "innovation" in scores and "feasibility" in scores:
                try:
                    total = float(scores["clarity"]) + float(scores["innovation"]) + float(scores["feasibility"])
                    all_scores.append({
                        "proposal_id": p_id,
                        "author": p.get("author", "Unknown"),
                        "total_score": total,
                        "scores": scores,
                        "status": p.get("status")
                    })
                except ValueError:
                    continue
        
        # Sort by total_score descending
        return sorted(all_scores, key=lambda x: x["total_score"], reverse=True)
        
    @gl.public.write
    def appeal_proposal(self, proposal_id: str, appeal_text: str) -> dict:
        contract_data = self.proposals.get(proposal_id)
        if not contract_data:
            return {"error": "unknown proposal"}

        prompt = f"""
        Re-evaluate this grant proposal considering the author's appeal.
        Rubric:
        1. Clarity 0-10
        2. Innovation 0-10
        3. Feasibility 0-10

        Original Proposal:
        {contract_data["text"]}
        
        Appeal / Context:
        {appeal_text}

        Return a JSON: '{{"clarity": #, "innovation": #, "feasibility": #}}'
        """
        
        results = gl.llm.complete(prompt)
        
        self.proposals[proposal_id]["scores"] = results
        self.proposals[proposal_id]["status"] = "APPEALED_AND_RESCORED"
        
        return results
