import { useState, useEffect } from 'react';
import { createClient, createAccount } from "genlayer-js";
import { simulator } from "genlayer-js/chains";

import AppShell from '../components/AppShell';
import ProposalComposer from '../components/ProposalComposer';
import { EvaluationTimeline } from '../components/EvaluationTimeline';
import { RankedResults } from '../components/RankedResults';

// The StudioNet contract address we deployed
const CONTRACT_ADDRESS = "0x55332F18b8c864CDd24EC6F7277c3bB416C0ee85";

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
        const config = {
            chain: simulator,
            account: account,
            endpoint: "https://studio.genlayer.com/api"
        };
        const browserClient = createClient(config);
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

            setEvaluationSteps(prev => [...prev, { title: "Blockchain Ingestion", detail: `Tx ${hash.slice(0, 10)}... pending finalization.` }]);

            await client.waitForTransactionReceipt({
                hash: hash,
                status: "FINALIZED",
                interval: 5000,
                retries: 24,
            });

            setEvaluationSteps(prev => [...prev, { title: "Blockchain Ingestion Complete", detail: `Tx finalized.` }]);

            setEvaluationSteps(prev => [...prev, { title: "Scoring Triggered", detail: "Requesting Multi-LLM consensus bounds..." }]);

            // Trigger score immediately to execute the Python LLM logic
            const scoreHash = await client.writeContract({
                address: CONTRACT_ADDRESS,
                functionName: "multi_score",
                args: [newProposalId],
                leaderOnly: true
            });

            setEvaluationSteps(prev => [...prev, { title: "AI Evaluation Initialized", detail: `Tx ${scoreHash.slice(0, 10)} pending...` }]);

            const receipt = await client.waitForTransactionReceipt({
                hash: scoreHash,
                status: "FINALIZED",
                interval: 5000,
                retries: 24,
            });

            console.log("Score receipt:", JSON.stringify(receipt));
            const resultStatus = (receipt as any)?.status_name || (receipt as any)?.result_name || "UNKNOWN";

            if (resultStatus === "ACCEPTED" || resultStatus === "MAJORITY_AGREE") {
                setEvaluationSteps(prev => [...prev, { title: "✅ Consensus Reached", detail: `Scores computed and logged on-chain! (${resultStatus})` }]);
            } else {
                setEvaluationSteps(prev => [...prev, { title: "⚠️ Transaction Finalized", detail: `Status: ${resultStatus}. Scores may not have been saved.` }]);
            }

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

            // Handle returned python strings representing JSON from LLM
            console.log("Raw GenLayer result:", result);

            try {
                // The new 0x66... contract perfectly returns a stringified JSON array
                const parsed = JSON.parse(result as string);
                console.log("Parsed Array:", parsed);
                if (Array.isArray(parsed)) {
                    console.log("Setting proposals into React State:", parsed);
                    setProposals(parsed);
                } else {
                    console.warn("Parsed result was not an array:", parsed);
                }
            } catch (e: any) {
                console.error("Could not parse result into JSON Array", e);
                alert("Could not parse JSON: " + e.message);
            }
        } catch (error: any) {
            console.error("Failed to read rankings:", error);
            alert("Failed to read from GenLayer: " + (error?.message || error?.toString()));
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
