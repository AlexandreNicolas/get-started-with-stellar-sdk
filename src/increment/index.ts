import {
  Contract,
  Keypair,
  rpc,
  scValToNative,
} from "@stellar/stellar-sdk";
import dotenv from "dotenv";
import { submitTransaction } from "../utils/helpers.js";
import { deployIncrementContract } from "./deploy.js";
import { simulateTransaction } from "../utils/simulate_transaction.js";

dotenv.config();

const STELLAR_RPC_URL = process.env.STELLAR_RPC_URL ?? "";
const PRIVATE_KEY = process.env.STELLAR_PRIVATE_KEY ?? "";

async function main() {
  console.log("--------------------------------");
  console.log("Increment Example");
  console.log("--------------------------------");

  // Initialize provider and signer
  const provider = new rpc.Server(STELLAR_RPC_URL);
  const keypair = Keypair.fromSecret(PRIVATE_KEY);

  console.log(`Stellar provider initialized successfully`);
  console.log(`User account: ${keypair.publicKey()}`);
  
  // Deploy the increment contract
  const contractAddress = await deployIncrementContract(provider, keypair);
  console.log(`Contract deployed successfully. Address: ${contractAddress}`);

  const incrementContract = new Contract(contractAddress);

  // Call increment function multiple times to demonstrate state persistence
  console.log("\n--- Calling increment() function multiple times ---");
  
  for (let i = 1; i <= 3; i++) {
    const incrementResponse = await submitTransaction({
      provider,
      signer: keypair,
      contract: incrementContract,
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

  // Demonstrate getting the current value
  console.log("\n--- Getting current value ---");
  const getValueResponse = await submitTransaction({
    provider,
    signer: keypair,
    contract: incrementContract,
    functionName: "get_count",
    args: [],
  });

  if (getValueResponse.returnValue) {
    const currentValue = scValToNative(getValueResponse.returnValue);
    console.log(`Current value: ${currentValue}`);
  } else {
    console.log("Current value: null");
  }

  // Demonstrate resetting the value
  console.log("\n--- Resetting value to 0 ---");
  await submitTransaction({
    provider,
    signer: keypair,
    contract: incrementContract,
    functionName: "reset",
    args: [],
  });

  // Verify the reset by getting the value again
  console.log("\n--- Verifying reset ---");
  const finalValueResponse = await simulateTransaction({
    provider,
    signer: keypair,
    contract: incrementContract,
    functionName: "get_count",
  });

  if (finalValueResponse) {
    const finalValue = scValToNative(finalValueResponse);
    console.log(`Final value after reset: ${finalValue}`);
  } else {
    console.log("Final value after reset: null");
  }
}

main();
