import { useState, useEffect } from 'react';
import { createClient, createAccount } from "genlayer-js";
import { simulator } from "genlayer-js/chains";

import AppShell from '../components/AppShell';
import ProposalComposer from '../components/ProposalComposer';
import { EvaluationTimeline } from '../components/EvaluationTimeline';
import { RankedResults } from '../components/RankedResults';

// The StudioNet contract address we deployed
const CONTRACT_ADDRESS = "0xb87E7682FFDED20398DF913e3019dDD43f56bb46";

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

            setEvaluationSteps(prev => [...prev, { title: "Scoring Required", detail: "Please trigger evaluator multi-score bounds." }]);

            // Optionally, trigger score immediately:
            // await client.writeContract({ address: CONTRACT_ADDRESS, functionName: "multi_score", args: [newProposalId] });

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
