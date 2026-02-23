import { useState } from 'react';
import AppShell from '../components/AppShell';
import ProposalComposer from '../components/ProposalComposer';
import { EvaluationTimeline } from '../components/EvaluationTimeline';
import { RankedResults } from '../components/RankedResults';

export default function Home() {
    const [proposals, setProposals] = useState<any[]>([]);
    const [newProposalText, setNewProposalText] = useState("");
    const [newProposalId, setNewProposalId] = useState("");

    // Simulated steps for UI feedback
    const [evaluationSteps, setEvaluationSteps] = useState<{ title: string; detail: string }[]>([]);

    const submitProposal = async () => {
        if (!newProposalId) return;

        // Simulate Intelligent Contract reasoning steps over time
        setEvaluationSteps([
            { title: "Proposal Received", detail: `ID ${newProposalId} ingested by IntContract.` },
            { title: "Analyzing Content", detail: "Scraping raw proposal strings via GenVM NLP..." }
        ]);

        setTimeout(() => {
            setEvaluationSteps(prev => [...prev, { title: "Multi-Agent Consensus (3)", detail: "Reviewing Rubric: Clarity, Innovation, Feasibility" }]);
        }, 1500);

        setTimeout(() => {
            setEvaluationSteps(prev => [...prev, { title: "Consensus Reached", detail: "Transaction committed to Finality Window." }]);
        }, 3000);
    };

    const getRankings = async () => {
        // Simulated rankings matching the new design object
        setProposals([
            {
                proposal_id: "DEMO-XYZ-01",
                status: "MULTI_SCORED",
                total_score: 24.5,
                scores: { clarity: 8.5, innovation: 9.0, feasibility: 7.0 }
            },
            {
                proposal_id: "PR-104",
                status: "MULTI_SCORED",
                total_score: 26.8,
                scores: { clarity: 9.2, innovation: 8.5, feasibility: 9.1 }
            },
            {
                proposal_id: "PR-211-DEFI",
                status: "MULTI_SCORED",
                total_score: 19.3,
                scores: { clarity: 6.0, innovation: 7.5, feasibility: 5.8 }
            }
        ].sort((a, b) => b.total_score - a.total_score)); // Highest first
    };

    return (
        <AppShell>
            <ProposalComposer
                proposalId={newProposalId}
                setProposalId={setNewProposalId}
                proposalText={newProposalText}
                setProposalText={setNewProposalText}
                onSubmit={submitProposal}
            />

            {evaluationSteps.length > 0 && (
                <EvaluationTimeline steps={evaluationSteps} />
            )}

            <RankedResults
                results={proposals}
                onFetch={getRankings}
            />
        </AppShell>
    );
}
