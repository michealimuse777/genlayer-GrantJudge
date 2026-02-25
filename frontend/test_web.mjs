import { createClient, createAccount } from "genlayer-js";
import { simulator } from "genlayer-js/chains";

const account = createAccount();
const client = createClient({ chain: simulator, account });

const CONTRACT = "0xC8C752555F906271Ff204e8147A9eD9A6678d605";

async function main() {
    console.log("Calling fetch_test with leaderOnly: true...");
    const hash = await client.writeContract({
        address: CONTRACT,
        functionName: "fetch_test",
        args: [],
        leaderOnly: true,
    });
    console.log("Tx hash:", hash);

    const receipt = await client.waitForTransactionReceipt({
        hash,
        status: "FINALIZED",
        interval: 5000,
        retries: 30,
    });
    console.log("Receipt status:", receipt.status_name || receipt.result_name);

    // Now read the result
    const result = await client.readContract({
        address: CONTRACT,
        functionName: "get_result",
        args: [],
    });
    console.log("Stored result:", result);
}

main().catch(console.error);
