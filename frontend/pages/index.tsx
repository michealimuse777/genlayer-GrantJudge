import { useState, useEffect } from 'react';
import { createClient } from "genlayer-js";
import { simulator } from "genlayer-js/chains";

import AppShell from '../components/AppShell';
import ProposalComposer from '../components/ProposalComposer';
import { EvaluationTimeline } from '../components/EvaluationTimeline';
import { RankedResults } from '../components/RankedResults';

// The StudioNet contract address we deployed
const CONTRACT_ADDRESS = "0xb87E7682FFDED20398DF913e3019dDD43f56bb46";

// Initialize genlayer simulator client
const client = createClient({
    chain: simulator,
});

export default function Home() {
    const [proposals, setProposals] = useState<any[]>([]);
    const [newProposalText, setNewProposalText] = useState("");
    const [newProposalId, setNewProposalId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Simulated steps for UI feedback as real transaction processes
    const [evaluationSteps, setEvaluationSteps] = useState<{ title: string; detail: string }[]>([]);

    const submitProposal = async () => {
        if (!newProposalId || isSubmitting) return;
        setIsSubmitting(true);

        setEvaluationSteps([
            { title: "Proposal Transmitted", detail: `ID ${newProposalId} sent to StudioNet...` }
        ]);

        try {
            // Write transaction to Smart Contract
            const hash = await client.writeContract({
                address: CONTRACT_ADDRESS,
                functionName: "submit_proposal",
                args: [newProposalId, newProposalText, "0xUserDemo"],
            });
            console.log("Transaction Hash:", hash);

            setEvaluationSteps(prev => [...prev, { title: "Blockchain Ingestion Complete", detail: `Tx ${hash.slice(0, 10)}... recorded.` }]);

            setEvaluationSteps(prev => [...prev, { title: "Scoring Required", detail: "Please trigger evaluator multi-score bounds." }]);

            // Optionally, trigger score immediately:
            // await client.writeContract({ address: CONTRACT_ADDRESS, functionName: "multi_score", args: [newProposalId] });

        } catch (error) {
            console.error("Submission failed:", error);
            setEvaluationSteps(prev => [...prev, { title: "Error", detail: "Transaction failed." }]);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRankings = async () => {
        try {
            // Read data from Smart Contract
            const result = await client.readContract({
                address: CONTRACT_ADDRESS,
                functionName: "rank_all",
                args: []
            });

            // Handle returned python lists/dicts representing JSON from LLM
            if (Array.isArray(result)) {
                setProposals(result);
            }
        } catch (error) {
            console.error("Failed to read rankings:", error);
        }
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
