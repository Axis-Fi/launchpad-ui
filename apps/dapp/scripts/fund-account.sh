#!/bin/bash

[ -f .env ] && source .env

ADDRESS=${1:-$FORK_ADDRESS}
AMOUNT=${2:-10}
PORT=${ANVIL_PORT:-8545}

WEI_AMOUNT=$(cast --to-wei "$AMOUNT" eth)

echo "Funding account $ADDRESS with ${WEI_AMOUNT} native gas tokens"

cast rpc anvil_setBalance "$ADDRESS" "$WEI_AMOUNT" --rpc-url "http://127.0.0.1:$PORT"