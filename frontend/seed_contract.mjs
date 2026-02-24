import { createClient, createAccount } from "genlayer-js";
import { simulator } from "genlayer-js/chains";

async function seedData() {
    try {
        console.log("Seeding StudioNet Contract...");
        const account = createAccount("0x1234567890123456789012345678901234567890123456789012345678901234");

        const studionetChain = {
            ...simulator,
            id: 61999,
        };

        const config = {
            chain: studionetChain,
            account: account,
            endpoint: "https://studio.genlayer.com/api"
        };
        const client = createClient(config);

        const CONTRACT_ADDRESS = "0x66e9fd23A4E9A0f4fE0703c9629304c1712D424d";
        const proposalId = "PR-CONSOLE-TEST";

        console.log("Submitting Proposal...");
        const hash = await client.writeContract({
            address: CONTRACT_ADDRESS,
            functionName: "submit_proposal",
            args: [proposalId, "Build an automated testing framework for GenLayer Next.js Apps", "0xDeveloper123"]
        });

        console.log("Waiting for blockchain finalization (Tx " + hash + ")...");
        await client.waitForTransactionReceipt({ hash, status: "FINALIZED", interval: 5000, retries: 24 });

        console.log("Triggering Multi-Score AI Consensus...");
        const scoreHash = await client.writeContract({
            address: CONTRACT_ADDRESS,
            functionName: "multi_score",
            args: [proposalId]
        });

        console.log("Waiting for AI processing (Tx " + scoreHash + ")...");
        await client.waitForTransactionReceipt({ hash: scoreHash, status: "FINALIZED", interval: 5000, retries: 24 });

        console.log("Success! Contract populated.");

    } catch (error) {
        console.error("ERROR:");
        console.error(error);
    }
}
seedData();
