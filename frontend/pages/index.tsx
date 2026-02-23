import { useState, useEffect } from 'react';
import { createClient, createAccount } from "genlayer-js";
import { simulator } from "genlayer-js/chains";

import AppShell from '../components/AppShell';
import ProposalComposer from '../components/ProposalComposer';
import { EvaluationTimeline } from '../components/EvaluationTimeline';
import { RankedResults } from '../components/RankedResults';

// The StudioNet contract address we deployed
const CONTRACT_ADDRESS = "0x5C79C9F87c539131A80d65Ad389e360EaD502D0F";

export default function Home() {
    const [proposals, setProposals] = useState<any[]>([]);
    const [newProposalText, setNewProposalText] = useState("");
    const [newProposalId, setNewProposalId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dynamically store the GenLayer client tied to the browser wallet
    const [client, setClient] = useState<any>(null);

    // Initialize the client on mount
    useEffect(() => {
        // We use the simulator chain with a hardcoded throwaway key
        // strictly because the JS SDK does not yet support browser extensions

        // The SDK requires the private key to be wrapped in an Account object
        const account = createAccount("0x1234567890123456789012345678901234567890123456789012345678901234");

        // The default "simulator" points to your localhost:4000
        // We override the RPC URL here to point directly to GenLayer StudioNet
        const studionetChain = {
            ...simulator,
            id: 61999, // StudioNet Chain ID
            rpcUrls: {
                default: { http: ['https://studio.genlayer.com/api'] },
                public: { http: ['https://studio.genlayer.com/api'] }
            }
        };

        const browserClient = createClient({
            chain: studionetChain,
            account: account
        });
        setClient(browserClient);
    }, []);

    // Simulated steps for UI feedback as real transaction processes
    const [evaluationSteps, setEvaluationSteps] = useState<{ title: string; detail: string }[]>([]);

    const submitProposal = async () => {
        if (!newProposalId || isSubmitting) return;

        if (!client) {
            setEvaluationSteps([{ title: "Wallet Error", detail: "Please install the GenLayer browser extension and connect." }]);
            return;
        }

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

            setEvaluationSteps(prev => [...prev, { title: "Scoring Triggered", detail: "Requesting Multi-LLM consensus bounds..." }]);

            // Trigger score immediately to execute the Python LLM logic
            const scoreHash = await client.writeContract({
                address: CONTRACT_ADDRESS,
                functionName: "multi_score",
                args: [newProposalId]
            });

            setEvaluationSteps(prev => [...prev, { title: "Consensus Reached", detail: `Scores computed in Tx ${scoreHash.slice(0, 10)}...` }]);

        } catch (error: any) {
            console.error("Submission failed:", error);
            // Show the actual error message in the UI so the user can see what failed
            const errorMsg = error?.message || error?.toString() || "Transaction failed.";
            setEvaluationSteps(prev => [...prev, { title: "Error", detail: errorMsg }]);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRankings = async () => {
        if (!client) {
            console.error("No GenLayer client configured.");
            return;
        }

        console.log("Fetching rankings from StudioNet...");

        try {
            // Read data from Smart Contract
            const result = await client.readContract({
                address: CONTRACT_ADDRESS,
                functionName: "rank_all",
                args: []
            });

            console.log("Raw GenLayer result:", result);

            // Handle returned python lists/dicts representing JSON from LLM
            if (Array.isArray(result)) {
                setProposals(result);
            } else {
                console.warn("Expected array, got:", typeof result, result);
                // Attempt to parse if it returned a raw stringified JSON wrapped in an object or primitive
                try {
                    const parsed = JSON.parse(result as any);
                    if (Array.isArray(parsed)) setProposals(parsed);
                } catch (e) {
                    console.error("Could not parse result into Array");
                }
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
