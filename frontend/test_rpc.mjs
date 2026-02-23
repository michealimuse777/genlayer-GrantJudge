import { createClient, createAccount } from "genlayer-js";
import { simulator } from "genlayer-js/chains";

async function checkDeployment() {
    console.log("Testing direct RPC connection to StudioNet...");
    try {
        const account = createAccount("0x1234567890123456789012345678901234567890123456789012345678901234");

        const studionetChain = {
            ...simulator,
            id: 61999,
            rpcUrls: {
                default: { http: ['https://studio.genlayer.com/api'] },
                public: { http: ['https://studio.genlayer.com/api'] }
            }
        };

        const client = createClient({
            chain: studionetChain,
            account: account
        });

        // Test basic network ping
        const blockNumber = await client.getBlockNumber();
        console.log("Connected! Current Block Number:", blockNumber);

    } catch (error) {
        console.error("RPC CONNECTION FAILED:");
        console.error(error);
    }
}

checkDeployment();
