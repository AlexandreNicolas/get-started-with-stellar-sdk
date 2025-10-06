import {
  BASE_FEE,
  Contract,
  Keypair,
  Networks,
  rpc,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";

interface SubmitStellarTransactionParams {
  provider: rpc.Server;
  signer: Keypair;
  networkPassphrase?: string;
  fee?: string;
  operation: xdr.Operation;
}

export interface SubmitTransactionParams {
  provider: rpc.Server;
  signer: Keypair;
  contract: Contract;
  functionName: string;
  args: xdr.ScVal[];
}

export async function submitTransaction({
  provider,
  signer,
  contract,
  functionName,
  args,
}: SubmitTransactionParams): Promise<rpc.Api.GetSuccessfulTransactionResponse> {
  const operation = contract.call(functionName, ...args);

  const submitTransactionParams: SubmitStellarTransactionParams = {
    provider,
    signer,
    networkPassphrase: Networks.TESTNET,
    fee: BASE_FEE,
    operation,
  };

  const successTx = await submitStellarTransaction(submitTransactionParams);
  return successTx;
}

async function submitStellarTransaction({
  provider,
  signer,
  networkPassphrase = Networks.TESTNET,
  fee = BASE_FEE,
  operation,
}: SubmitStellarTransactionParams): Promise<rpc.Api.GetSuccessfulTransactionResponse> {
  const keypair = signer;
  const signerAccount = await provider.getAccount(signer.publicKey());

  const transaction = new TransactionBuilder(signerAccount, { fee })
    .setNetworkPassphrase(networkPassphrase)
    .setTimeout(30)
    .addOperation(operation)
    .build();

  const preparedTransaction = await provider.prepareTransaction(transaction);
  preparedTransaction.sign(keypair);

  const response = await provider.sendTransaction(preparedTransaction);
  const successTx = await getPollingTransaction(provider, response.hash);

  return successTx;
}

export async function getPollingTransaction(
  server: rpc.Server,
  hash: string
): Promise<rpc.Api.GetSuccessfulTransactionResponse> {
  try {
    const tx = await server.pollTransaction(hash);

    if (tx.status === "SUCCESS") {
      if (tx.returnValue) {
        return tx;
      } else {
        throw new Error("Transaction has no return value");
      }
    } else if (tx.status === "FAILED") {
      throw new Error("Transaction failed");
    } else {
      throw new Error("Unknown status");
    }
  } catch (error) {
    throw new Error("Error fetching transaction");
  }
}
