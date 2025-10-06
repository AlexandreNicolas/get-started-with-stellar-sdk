#![cfg(test)]
use crate::{IncrementContract, IncrementContractClient};
use soroban_sdk::{
  testutils::{EnvTestConfig, Ledger as _},
  Env,
};

const INITIAL_SEQUENCE_NUMBER: u32 = 10;

pub fn setup_test_env() -> Env {
    let mut env = Env::default();
  
    env.set_config(EnvTestConfig {
      capture_snapshot_at_drop: false,
    });
    env.ledger().set_sequence_number(INITIAL_SEQUENCE_NUMBER);
    env.mock_all_auths();
  
    env
  }

#[test]
fn test() {
    let env = setup_test_env();

    let contract_id = env.register(IncrementContract, ());
    let client = IncrementContractClient::new(&env, &contract_id);

    assert_eq!(client.increment(), 1);
    assert_eq!(client.increment(), 2);
    assert_eq!(client.increment(), 3);
    assert_eq!(client.get_count(), 3);
}

#[test]
fn test_reset() {
    let env = setup_test_env();

    let contract_id = env.register(IncrementContract, ());
    let client = IncrementContractClient::new(&env, &contract_id);

    assert_eq!(client.increment(), 1);
    assert_eq!(client.increment(), 2);
    assert_eq!(client.increment(), 3);
    client.reset();
    assert_eq!(client.get_count(), 0);
}