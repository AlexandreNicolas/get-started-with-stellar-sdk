# Get Started With Stellar SDK

This repository contains TypeScript/JavaScript examples demonstrating how to use the Stellar SDK to interact with smart contracts on the Stellar network. It provides practical, working examples that show the complete lifecycle of smart contract deployment and interaction.

> [!WARNING]  
> These implementations are educational examples, and have not been tested or audited. They are likely to have significant errors and security vulnerabilities. They should not be relied on for any purpose. Please refer to the license for more information.

## What This Project Contains

This project includes TypeScript examples that demonstrate:

- **Smart Contract Deployment**: How to upload WASM files and deploy contracts to Stellar testnet
- **Contract Interaction**: How to call contract functions and handle responses
- **Transaction Management**: How to build, sign, and submit transactions
- **Error Handling**: Proper error handling and transaction polling

## Available Examples

The examples in this repository:

- **hello_world**: The simplest smart contract example - demonstrates basic contract deployment and function calling
- **events**: This contract demonstrates how to publish events from a contract 
- **increment**: Demonstrates how to increment a stored value and returning the updated value

## Quick Start

### 1. Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Stellar CLI (for contract compilation)
- Rust toolchain (for building contracts)

### 2. Installation

```bash
# Clone this repository
git clone https://github.com/AlexandreNicolas/get-started-with-stellar-sdk.git
cd get-started-with-stellar-sdk

# Install dependencies
npm install
```

### 3. Get Testnet Account

#### Create Identity
If an identity for signing transactions has already been created, this part can be skipped. 

When deploying a smart contract to a network, an identity that will be used to sign the transactions must be specified. Let's configure an identity called alice. Any name can be used, but it might be convenient to have some named identities for testing, such as alice, bob, and carol. Notice that the account will be funded using [Friendbot](https://developers.stellar.org/docs/learn/fundamentals/networks#friendbot). 


```bash
# Install Stellar CLI first, then create a testnet account
stellar keys generate --global alice --network testnet --fund

# Get your private key
stellar keys show alice --private-key
```

See the [documentation](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup#configure-an-identity) for more information about identities.


### 4. Environment Setup

Create a `.env` file in the project root and save the private-key genereted:

```env
# Stellar Testnet RPC URL
STELLAR_RPC_URL=https://soroban-testnet.stellar.org:443

# Your Stellar account private key (for testnet)
STELLAR_PRIVATE_KEY=your_private_key_here
```

### 5. Run Examples

```bash
# Run the Hello World example
npm run hello-world

# Build and run other examples
npm run build
npm start
```

## Detailed Documentation

Each example includes comprehensive documentation:

- **[Hello World Example](./src/hello_world/README.md)**: Complete guide to the hello_world example
- **Contract-specific READMEs**: Check individual example directories for detailed instructions

## Get Started with Smart Contracts


## Installation
Stellar smart contracts are written in the [Rust](https://www.rust-lang.org/) programming language and can be deployed to the testnet or mainnet. 

### Prerequisites
To build and develop contracts you need only a couple prerequisites:

- A [Rust](https://www.rust-lang.org/) toolchain
- An editor that supports Rust
- [Stellar CLI](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup#install-the-stellar-cli)

See the [documentation](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup) for more prerequisites installation instructions. 


### Run Smart Contracts
*Note: The `increment` contract is used in these instructions, but the instructions are similar for the other contracts, except for how to invoke the contracts.*

The smart contracts can easily be run by deploying them to testnet. Choose a contract and follow these instructions. 

#### Build
First the smart contract must be built with this command from the `increment` contract’s root folder:

```
cd increment
stellar contract build
```

A `.wasm` file will be outputted in the target directory, at `target/wasm32v1-none/release/soroban_increment_contract.wasm`. The `.wasm` file is the built contract.

#### Deploy
The WASM file can now be deployed to the testnet by running this command:

```
stellar contract deploy \
  --wasm target/wasm32v1-none/release/soroban_increment_contract.wasm \
  --source alice \
  --network testnet \
  --alias increment_contract
```

When the smart contract has been successfully deployed, the command will return the contract’s ID (e.g. CACDYF3CYMJEJTIVFESQYZTN67GO2R5D5IUABTCUG3HXQSRXCSOROBAN). This ID can be used to invoke the contract, but since an alias is added, the alias can be used for invoking the contract as well.

#### Invoke
Now the contract is on testnet, it can be invoked. For the increment contract there’s only one function to invoke, and that’s the increment() function. Look at the code for the other contracts to see which function to invoke as every example contract is different.

Run this command to invoke the increment contract (the added alias is used as the contract ID):

```
stellar contract invoke \
  --id increment_contract \
  --source alice \
  --network testnet \
  -- \
  increment 
```

The contract will return 1 the first time it’s run, run it again and see the returned value is being incremented.

## Testing
Each of the example smart contracts also has a test file that has test cases for each of the features of the smart contracts. The test will just return a pass/fail result, but it’s a convenient way to check if the code works, without deploying and invoking the contract manually. 

From the root of the contract (e.g. `increment`) run this command:

```
cargo test
```

Some examples may contain multiple contracts and require contracts to be built before the test can be run. See the individual example contracts for details.

## Licence
The example smart contracts are licensed under the Apache 2.0 license. See the LICENSE file for details.

## Contributions
Contributions are welcome, please create a pull request with the following information: 

- Explain the changes/additions you made
- Why are these changes/additions needed or relevant?
- How did you solve the problem, or created the suggested feature?
- Have your changes/additions been thoroughly tested?

## Relevant Links:
- [Smart Contract Documentation](https://developers.stellar.org/docs/build)
- [Getting Started Guide](https://developers.stellar.org/docs/build/smart-contracts/getting-started)
- [Example descriptions in the documentation](https://developers.stellar.org/docs/build/smart-contracts/example-contracts)
- [Stellar Developers Discord server](https://discord.gg/stellardev)

