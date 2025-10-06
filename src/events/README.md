# Events Example with Stellar SDK

This example demonstrates how to deploy and interact with a Stellar smart contract that publishes events. The events contract showcases event emission, state management, and how to work with contract events in the Stellar ecosystem.

## Overview

The Events example demonstrates:

1. **Event Publishing**: How smart contracts can emit events with topics and data
2. **State Management**: Maintains a counter with persistent storage
3. **Event Structure**: Understanding event topics and data formats
4. **Event Listening**: How to subscribe to and process contract events
5. **Simulation**: Using simulation for read-only operations

## How It Works

### Contract Functions

The events contract provides one main function:

1. **`increment()`**: 
   - Increments the stored counter by 1
   - Publishes an `IncrementEvent` with topics `["COUNTER", "increment"]` and data containing the count
   - Returns the new counter value

### Event Structure

The contract publishes events with the following structure:

```rust
#[contractevent(topics = ["COUNTER", "increment"], data_format = "single-value")]
struct IncrementEvent {
    count: u32,
}
```

- **Topics**: `["COUNTER", "increment"]` - Static topics for event filtering
- **Data**: The current count value (u32) - Single value format
- **Event Name**: `IncrementEvent` - The event type

### Event Publishing

Each call to `increment()` triggers:
1. State update (counter increment)
2. Event emission with current count
3. Return value (new count)

## Running the Example

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Events Example

```bash
npm run events
```

### Expected Output

```
--------------------------------
Events Example
--------------------------------
Stellar provider initialized successfully
User account: GABC123...
Deploying Events Contract...
Uploaded Wasm: abc123...
Deployed Events Contract: CDEF456...

--- Calling increment() function to generate events ---
Increment call #1: 1
Increment call #2: 2
Increment call #3: 3

--- Getting current count (simulation) ---
Current count (simulated): 3

--- Event Information ---
Events are published by the contract with the following structure:
- Topics: ['COUNTER', 'increment']
- Data: The current count value (u32)
- Each increment() call publishes one event

To listen for events in a real application, you would:
1. Subscribe to contract events using the RPC server
2. Filter events by contract address and topics
3. Process the event data as needed

Example event subscription code:
[Event subscription code example]
```

## Code Structure

```
src/events/
├── index.ts          # Main example file
├── deploy.ts         # Contract deployment logic
└── README.md         # This documentation

src/utils/
├── helpers.ts        # Utility functions for transaction handling
├── deploy.ts         # Shared deployment utilities
└── simulate_transaction.ts  # Simulation utilities
```

## Key Functions

### `deployEventsContract(provider, signer)`
- Uploads the events contract WASM file to the network
- Creates a new contract instance
- Returns the contract address

### Contract Function Calls

#### `increment()`
- Increments the stored counter by 1
- Publishes an `IncrementEvent` with topics and data
- Returns the new counter value
- Demonstrates event emission

### Event Handling

#### Event Structure
```typescript
interface IncrementEvent {
  topics: ["COUNTER", "increment"];
  data: u32; // The count value
}
```

#### Event Subscription
```typescript
// Subscribe to events from the contract
 const eventsResponse = await provider.getEvents({
    startLedger: ledger.sequence - 100,
    filters: [{ contractIds: [contractAddress || ''] }],
    limit: 1000
  });
```

## Event Concepts

### Event Topics
- **Static Topics**: `["COUNTER", "increment"]` - Used for filtering events
- **Topic Filtering**: Allows subscribing to specific event types
- **Hierarchical**: Topics can be organized in a hierarchy

### Event Data
- **Single Value Format**: Simple data structure for easy parsing
- **Type Safety**: Events have defined data types
- **Serialization**: Data is automatically serialized/deserialized

### Event Lifecycle
1. **Contract Execution**: Function call triggers event emission
2. **Event Creation**: Contract creates event with topics and data
3. **Event Publishing**: Event is published to the network
4. **Event Storage**: Event is stored in the ledger
5. **Event Retrieval**: Clients can query events via RPC

## Advanced Usage

### Event Filtering
```typescript
// Filter events by specific topics
const filteredEvents = await provider.getEvents({
  contractAddress: contractAddress,
  topics: [['COUNTER']], // Only events with 'COUNTER' as first topic
  startLedger: 'latest',
  pagination: { limit: 50 }
});
```

## Next Steps

After successfully running the Events example, you can:

1. Explore more complex event structures
2. Learn about event indexing and search
3. Implement real-time event monitoring
4. Build event-driven applications
5. Deploy to mainnet when ready for production

## Additional Resources

- [Stellar Smart Contracts Documentation](https://developers.stellar.org/docs/build/smart-contracts)
- [Stellar SDK Documentation](https://stellar.github.io/js-stellar-sdk/)
- [Event System Documentation](https://developers.stellar.org/docs/build/smart-contracts/events)
- [Stellar Discord Community](https://discord.gg/stellardev)
