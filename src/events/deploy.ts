import {
  Keypair,
  rpc,
} from "@stellar/stellar-sdk";
import { deployContract, uploadWasm } from "../utils/deploy.js";

export async function deployEventsContract(
  provider: rpc.Server,
  signer: Keypair
) {
  console.log("Deploying Events Contract...");

  const wasmFilePath =
    "contracts/events/target/wasm32v1-none/release/soroban_events_contract.wasm";
  const uploadResponse = await uploadWasm(provider, signer, wasmFilePath);
  const contractAddress = await deployContract(
    provider,
    signer,
    uploadResponse
  );
  console.log(`Contract deployed successfully: ${contractAddress}`);

  return contractAddress;
}
