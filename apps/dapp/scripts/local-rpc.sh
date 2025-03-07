#!/bin/bash

[ -f .env ] && source .env

# Check if fork URL is set
if [ -z "$ANVIL_FORK_URL" ]; then
  echo "Error: ANVIL_FORK_URL environment variable is required"
  echo "Please set it in your .env file or environment"
  exit 1
fi

# Run anvil with environment variables or defaults
anvil \
  --chain-id ${ANVIL_CHAIN_ID:-84532} \
  --fork-block-number ${ANVIL_FORK_BLOCK_NUMBER:-22759770} \
  --block-time ${ANVIL_BLOCK_TIME:-1} \
  --fork-url ${ANVIL_FORK_URL} \
  --port ${ANVIL_PORT:-8545} &

ANVIL_PID=$!

# Wait for anvil to start
sleep 2

if [ ! -z "$FORK_ADDRESS" ]; then  
  ./scripts/fund-account.sh "$FORK_ADDRESS" "${FORK_FUND_AMOUNT:-10}"
fi

# Wait for Anvil to exit
wait $ANVIL_PID