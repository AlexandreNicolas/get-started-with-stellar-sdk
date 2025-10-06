import { Contract, Keypair, rpc, scValToNative } from "@stellar/stellar-sdk";
import dotenv from "dotenv";
import { deployEventsContract } from "./deploy.js";
import { submitTransaction } from "../utils/helpers.js";



dotenv.config();

const STELLAR_RPC_URL = process.env.STELLAR_RPC_URL ?? "";
const PRIVATE_KEY = process.env.STELLAR_PRIVATE_KEY ?? "";

async function main() {
  console.log("--------------------------------");
  console.log("Events Example");
  console.log("--------------------------------");

  // Initialize provider and signer
  const provider = new rpc.Server(STELLAR_RPC_URL);
  const keypair = Keypair.fromSecret(PRIVATE_KEY);

  console.log(`Stellar provider initialized successfully`);
  console.log(`User account: ${keypair.publicKey()}`);

  // Deploy the events contract
  const contractAddress = await deployEventsContract(provider, keypair);

  const eventsContract = new Contract(contractAddress);

  // Call increment function multiple times to generate events
  console.log("\n--- Calling increment() function to generate events ---");

  for (let i = 1; i <= 3; i++) {
    const incrementResponse = await submitTransaction({
      provider,
      signer: keypair,
      contract: eventsContract,
      functionName: "increment",
      args: [],
    });

    if (incrementResponse.returnValue) {
      const incrementValue = scValToNative(incrementResponse.returnValue);
      console.log(`Increment call #${i}: ${incrementValue}`);
    } else {
      console.log(`Increment call #${i}: null`);
    }
  }
  const ledger = await provider.getLatestLedger();

  // Subscribe to events from this contract
  const eventsResponse = await provider.getEvents({
    startLedger: ledger.sequence - 100,
    filters: [{ contractIds: [contractAddress || ''] }],
    limit: 1000
  });

  for (const event of eventsResponse.events) {
    const [topicSymbol] = event.topic;
    const topic = scValToNative(topicSymbol);
    const value = scValToNative(event.value);
    console.log("Topic:", topic);
    console.log("Value:", value);
  }
}

main();
