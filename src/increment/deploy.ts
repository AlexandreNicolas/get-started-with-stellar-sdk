import {
  Keypair,
  rpc,
} from "@stellar/stellar-sdk";
import { deployContract, uploadWasm } from "../utils/deploy.js";

export async function deployIncrementContract(
  provider: rpc.Server,
  signer: Keypair
) {
  console.log("Deploying Increment Contract...");

  const wasmFilePath =
    "contracts/increment/target/wasm32v1-none/release/soroban_increment_contract.wasm";
  const uploadResponse = await uploadWasm(provider, signer, wasmFilePath);
  const contractAddress = await deployContract(
    provider,
    signer,
    uploadResponse
  );
  console.log(`Deployed Increment Contract: ${contractAddress}`);

  return contractAddress;
}
