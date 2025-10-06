import {
  BASE_FEE,
  Contract,
  Keypair,
  Networks,
  rpc,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { xdr } from "@stellar/stellar-sdk";

export interface SimulateTransactionParams {
  provider: rpc.Server;
  signer: Keypair;
  contract: Contract;
  functionName: string;
}

export async function simulateTransaction({
  provider,
  signer,
  contract,
  functionName,
}: SimulateTransactionParams): Promise<xdr.ScVal> {
  try {
    const sourceAccount = await provider.getAccount(signer.publicKey());
    const fee = BASE_FEE;
    const transaction = new TransactionBuilder(sourceAccount, { fee })
      .setNetworkPassphrase(Networks.TESTNET)
      .setTimeout(30)
      .addOperation(contract.call(functionName))
      .build();

    const sim = await provider.simulateTransaction(transaction);
    if ("result" in sim && sim.result) {
      return sim.result.retval;
    } else if ("error" in sim) {
      throw new Error("Failed to simulate transaction " + sim.error);
    } else {
      throw new Error("Failed to simulate transaction");
    }
  } catch (error) {
    throw new Error("Failed to simulate transaction " + error);
  }
}
