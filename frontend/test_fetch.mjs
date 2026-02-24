import { createClient, createAccount } from "genlayer-js";
import { simulator } from "genlayer-js/chains";

const account = createAccount("0x1234567890123456789012345678901234567890123456789012345678901234");
const client = createClient({
    chain: simulator,
    account: account,
    endpoint: "https://studio.genlayer.com/api"
});

const CONTRACT = "0x11793BCaab9Af958906d5E88de72C839E9b9218A";

async function main() {
    console.log("Triggering multi_score with leaderOnly: true...");

    try {
        const hash = await client.writeContract({
            address: CONTRACT,
            functionName: "multi_score",
            args: ["TEST-3"],
            leaderOnly: true
        });
        console.log("TX Hash:", hash);

        console.log("Waiting for finalization...");
        const receipt = await client.waitForTransactionReceipt({
            hash: hash,
            status: "FINALIZED",
            interval: 5000,
            retries: 30,
        });
        console.log("Receipt:", JSON.stringify(receipt, null, 2));
    } catch (e) {
        console.error("ERROR:", e);
    }

    // Now read rank_all
    try {
        const rankings = await client.readContract({
            address: CONTRACT,
            functionName: "rank_all",
            args: []
        });
        console.log("RANKINGS:", rankings);
    } catch (e) {
        console.error("RANK_ALL ERROR:", e);
    }
}

main();
