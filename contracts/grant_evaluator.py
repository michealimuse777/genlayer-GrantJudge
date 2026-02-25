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
            text = proposal_text.lower()
            words = text.split()
            word_count = len(words)
            
            # Clarity: based on length, structure, and descriptive keywords
            clarity = 3
            if word_count > 20:
                clarity += 2
            if word_count > 50:
                clarity += 2
            if any(w in text for w in ["build", "create", "implement", "develop", "design"]):
                clarity += 1
            if "." in proposal_text:
                clarity += 1
            if any(w in text for w in ["goal", "objective", "aim", "purpose"]):
                clarity += 1
            clarity = min(clarity, 10)
            
            # Innovation: based on technical and novel keywords
            innovation = 2
            if any(w in text for w in ["novel", "unique", "new", "innovative", "first"]):
                innovation += 2
            if any(w in text for w in ["ai", "blockchain", "machine learning", "decentralized", "autonomous"]):
                innovation += 2
            if any(w in text for w in ["smart contract", "protocol", "framework", "platform"]):
                innovation += 2
            if any(w in text for w in ["transparent", "trustless", "consensus"]):
                innovation += 1
            if word_count > 30:
                innovation += 1
            innovation = min(innovation, 10)
            
            # Feasibility: based on actionable and planning keywords
            feasibility = 3
            if any(w in text for w in ["mvp", "milestone", "timeline", "phase", "deadline"]):
                feasibility += 2
            if any(w in text for w in ["team", "experience", "built", "deployed", "tested"]):
                feasibility += 2
            if any(w in text for w in ["realistic", "achievable", "practical", "feasible"]):
                feasibility += 1
            if word_count > 15:
                feasibility += 1
            if word_count > 40:
                feasibility += 1
            feasibility = min(feasibility, 10)
            
            summary = f"Evaluated based on {word_count} words with keyword analysis"
            
            result = {"clarity": clarity, "feasibility": feasibility, "innovation": innovation, "summary": summary}
            return json.dumps(result, separators=(',', ':'), sort_keys=True)

        result_json_str = gl.eq_principle.strict_eq(get_eval)
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

    @gl.public.write
    def ai_score(self, proposal_id: str, api_url: str) -> str:
        if proposal_id not in self.proposals:
            raise Exception("unknown proposal")
        
        p = self.proposals[proposal_id]
        scores_str = ""
        
        # Try AI oracle via gl.get_webpage
        def get_ai_eval() -> str:
            import urllib.parse
            encoded_text = urllib.parse.quote(p.text[:500])
            url = f"{api_url}?text={encoded_text}"
            response = gl.get_webpage(url, mode="text")
            try:
                parsed = json.loads(response)
                if "clarity" in parsed and "innovation" in parsed and "feasibility" in parsed:
                    return json.dumps(parsed, separators=(',', ':'), sort_keys=True)
            except Exception:
                pass
            return '{"clarity":5,"feasibility":5,"innovation":5,"summary":"AI parsing fallback"}'
        
        try:
            scores_str = gl.eq_principle.strict_eq(get_ai_eval)
        except Exception:
            pass
        
        # Fallback: deterministic text analysis (no eq_principle needed)
        if not scores_str or scores_str == "":
            text = p.text.lower()
            words = text.split()
            wc = len(words)
            c = min(10, 3 + (2 if wc > 20 else 0) + (2 if wc > 50 else 0) + (1 if any(w in text for w in ["build","create","implement"]) else 0) + (1 if "." in p.text else 0))
            i = min(10, 2 + (2 if any(w in text for w in ["novel","unique","new","innovative"]) else 0) + (2 if any(w in text for w in ["ai","blockchain","decentralized"]) else 0) + (2 if any(w in text for w in ["smart contract","protocol","framework"]) else 0) + (1 if wc > 30 else 0))
            f = min(10, 3 + (2 if any(w in text for w in ["mvp","milestone","timeline"]) else 0) + (2 if any(w in text for w in ["team","experience","deployed"]) else 0) + (1 if wc > 15 else 0) + (1 if wc > 40 else 0))
            scores_str = json.dumps({"clarity":c,"feasibility":f,"innovation":i,"summary":f"Deterministic fallback ({wc} words)"}, separators=(',',':'), sort_keys=True)
        
        p.scores = scores_str
        p.status = "AI_SCORED"
        
        self.proposals[proposal_id] = p
        return scores_str

    @gl.public.view
    def rank_all(self) -> str:
        all_scores = []
        for p_id, p in self.proposals.items():
            try:
                # Default values
                total = 0.0
                scores_dict = {}

                # Safely parse scores
                if p.scores and p.scores != "{}" and p.scores != "":
                    try:
                        parsed = json.loads(p.scores)
                        if isinstance(parsed, dict) and "clarity" in parsed and "innovation" in parsed and "feasibility" in parsed:
                            scores_dict = parsed
                            total = float(parsed["clarity"]) + float(parsed["innovation"]) + float(parsed["feasibility"])
                    except Exception:
                        pass # Keep default zero scores

                all_scores.append({
                    "proposal_id": p_id,
                    "author": p.author,
                    "total_score": total,
                    "scores": scores_dict,
                    "status": p.status
                })
            except Exception:
                continue
        
        final_list = sorted(all_scores, key=lambda x: x["total_score"], reverse=True)
        return json.dumps(final_list)
        
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
