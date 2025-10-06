# Hello World Example with Stellar SDK

This example demonstrates how to deploy and interact with a simple Stellar smart contract using the Stellar SDK for TypeScript/JavaScript.

## Overview

The Hello World example showcases the complete lifecycle of a Stellar smart contract:

1. **Deployment**: Uploads and deploys a WASM contract to the Stellar testnet
2. **Interaction**: Calls the contract's `hello` function with a parameter
3. **Response**: Receives and displays the contract's response

## How It Works

### Contract Deployment Process

The deployment process involves two main steps:

1. **WASM Upload** (`uploadWasm` function):
   - Reads the compiled WASM file from `contracts/hello_world/target/wasm32v1-none/release/soroban_hello_world_contract.wasm`
   - Creates an `uploadContractWasm` operation
   - Submits the transaction to upload the contract bytecode to the network

2. **Contract Creation** (`deployContract` function):
   - Uses the uploaded WASM hash to create a new contract instance
   - Generates a unique contract address using the transaction hash as salt
   - Returns the contract address for future interactions

### Contract Interaction

The example then demonstrates how to interact with the deployed contract:

1. **Contract Instance**: Creates a `Contract` object using the deployed contract address
2. **Function Call**: Calls the `hello` function with a string parameter (" World")
3. **Response Processing**: Converts the contract's response back to a native JavaScript value

### Key Components

- **RPC Provider**: Connects to Stellar testnet via RPC
- **Keypair**: Handles transaction signing and authentication
- **Transaction Builder**: Constructs and submits transactions
- **Contract Interface**: Provides type-safe contract interaction


## Running the Example

### 1. Install Dependencies

In the root of project, run:

```bash
npm install
```

### 2. Run the Hello World Example

```bash
npm run hello-world
```

### Expected Output

```
--------------------------------
Hello World Example
--------------------------------
Stellar provider initialized successfully
User account: GABC123...
Deploying Hello World Contract...
Uploaded Wasm: abc123...
Deployed Hello World Contract: CAVC2DZZHDAZ7UKZIK6O5C3PM3RPFJF6QJJTVV5DNNSOCTKWUHV2VCLN
Hello World response: Hello, World
```

## Code Structure

```
src/hello_world/
├── index.ts          # Main example file
├── deploy.ts         # Contract deployment logic
└── README.md         # This documentation

src/utils/
└── helpers.ts        # Utility functions for transaction handling
```

## Key Functions

### `deployHelloWorldContract(provider, signer)`
- Uploads the WASM file to the network
- Creates a new contract instance
- Returns the contract address

### `submitTransaction(params)`
- Generic function for calling contract methods
- Handles transaction building, signing, and submission
- Returns the transaction response

### `getPollingTransaction(server, hash)`
- Polls the network for transaction completion
- Handles success/failure status checking

## Troubleshooting

### Common Issues

1. **WASM file not found**:
   ```
   ERROR: Required WASM file not found at contracts/hello_world/target/wasm32v1-none/release/soroban_hello_world_contract.wasm!
   ```
   **Solution**: Ensure you've compiled the contract and copied the WASM file to the correct location.

2. **Invalid private key**:
   ```
   Error: Invalid secret key
   ```
   **Solution**: Verify your private key in the `.env` file is correct and properly formatted.

3. **Insufficient balance**:
   ```
   Error: Transaction failed
   ```
   **Solution**: Ensure your testnet account has sufficient XLM for transaction fees. Use Friendbot to fund your account.

4. **Network connection issues**:
   ```
   Error: Failed to connect to RPC server
   ```
   **Solution**: Check your internet connection and verify the RPC URL in your `.env` file.

## Next Steps

After successfully running the Hello World example, you can:

1. Explore other contract examples in the `soroban-examples` repository
2. Modify the contract parameters to see different responses
3. Learn about more advanced Stellar SDK features
4. Deploy to mainnet (with real XLM) when ready for production

## Additional Resources

- [Stellar Smart Contracts Documentation](https://developers.stellar.org/docs/build/smart-contracts)
- [Stellar SDK Documentation](https://stellar.github.io/js-stellar-sdk/)
- [Stellar Discord Community](https://discord.gg/stellardev)
