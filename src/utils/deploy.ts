import {
  Address,
  BASE_FEE,
  Keypair,
  Networks,
  Operation,
  rpc,
  StrKey,
  Transaction,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
import fs from "fs";
import { getPollingTransaction } from "./helpers.js";

export async function uploadWasm(
  provider: rpc.Server,
  signer: Keypair,
  filePath: string
): Promise<rpc.Api.GetSuccessfulTransactionResponse> {
  if (fs.existsSync(filePath)) {
    const bytecode = fs.readFileSync(filePath);
    const operation = Operation.uploadContractWasm({ wasm: bytecode });
    const response = await buildAndSendTransaction(provider, signer, operation);
    console.log(`Uploaded Wasm: ${response.txHash}`);
    return response;
  } else {
    console.error(`\nERROR: Required WASM file not found at ${filePath}!`);
    console.error(
      "\nPlease run the following command to compile contracts first:"
    );
    console.error("\n    make build\n");
    process.exit(1);
  }
}

export async function deployContract(
  provider: rpc.Server,
  signer: Keypair,
  response: rpc.Api.GetSuccessfulTransactionResponse
): Promise<string> {
  if (!response.returnValue?.bytes()) {
    throw new Error(`Transaction failed: ${response.txHash}`);
  }

  const signerAddress = Address.fromString(signer.publicKey());
  const operation = Operation.createCustomContract({
    wasmHash: response.returnValue.bytes(),
    address: signerAddress,
    salt: Buffer.from(response.txHash, "hex"),
  });
  const responseDeploy = await buildAndSendTransaction(
    provider,
    signer,
    operation
  );

  if (responseDeploy.returnValue) {
    const contractAddress = StrKey.encodeContract(
      Address.fromScAddress(responseDeploy.returnValue?.address()).toBuffer()
    );
    return contractAddress;
  } else {
    throw new Error(`Transaction failed: ${response.txHash}`);
  }
}

async function buildAndSendTransaction(
  provider: rpc.Server,
  signer: Keypair,
  operations: xdr.Operation
): Promise<rpc.Api.GetSuccessfulTransactionResponse> {
  const transaction = await buildTransaction(provider, signer, operations);
  const prepTx = await provider.prepareTransaction(transaction);
  prepTx.sign(Keypair.fromSecret(signer.secret()));

  const response = await provider.sendTransaction(prepTx);
  const hash = response.hash;

  const tx = await getPollingTransaction(provider, hash);
  return tx;
}

async function buildTransaction(
  provider: rpc.Server,
  signer: Keypair,
  operations: xdr.Operation
): Promise<Transaction> {
  const account = await provider.getAccount(signer.publicKey());
  return new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(operations)
    .setTimeout(30)
    .build();
}
