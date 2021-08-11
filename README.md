# Phala ChainBridge Operator

## Deprecation

This repository serves as an early prototype of Phala's ChainBridge web app.

It has been moved to https://github.com/Phala-Network/wpcap/tree/master/apps/chainbridge-operator

## Prepare

```sh
# install dependencies
yarn install

# build polkadot augmented types for Phala chain(s)
yarn typegen:from-defs

# build polkadot augmented API typings for Phala chain(s)
# e.g. `yarn typegen:from-chain wss://poc4-dev.phala.network/ws`
yarn typegen:from-chain <websocket-endpoint>
```

## Build for production

```sh
yarn build
```

## Run development server

```sh
yarn dev
```
