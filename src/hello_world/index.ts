import {
  Contract,
  Keypair,
  nativeToScVal,
  rpc,
  scValToNative,
} from "@stellar/stellar-sdk";
import dotenv from "dotenv";
import { deployHelloWorldContract } from "./deploy.js";
import { submitTransaction } from "../utils/helpers.js";

dotenv.config();

const STELLAR_RPC_URL = process.env.STELLAR_RPC_URL ?? "";
const PRIVATE_KEY = process.env.STELLAR_PRIVATE_KEY ?? "";

async function main() {
  console.log("--------------------------------");
  console.log("Hello World Example");
  console.log("--------------------------------");

  // Initialize provider and signer
  const provider = new rpc.Server(STELLAR_RPC_URL);
  const keypair = Keypair.fromSecret(PRIVATE_KEY);

  console.log(`Stellar provider initialized successfully`);
  console.log(`User account: ${keypair.publicKey()}`);
  const contractAddress = await deployHelloWorldContract(provider, keypair);

  const helloWorldContract = new Contract(contractAddress);

  const helloWorldInvocation = await submitTransaction({
    provider,
    signer: keypair,
    contract: helloWorldContract,
    functionName: "hello",
    args: [nativeToScVal(" World", { type: "string" })],
  });

  if (helloWorldInvocation.returnValue) {
    const helloWorldToNative = scValToNative(helloWorldInvocation.returnValue);
    console.log(`Hello World response: ${helloWorldToNative}`);
  } else {
    console.log("Hello World response: null");
  }
}

main();
