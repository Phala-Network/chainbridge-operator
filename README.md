# Phala ChainBridge Operator

### Prepare

```sh
# install dependencies
yarn install

# build polkadot augmented types for Phala chain(s)
yarn typegen:from-defs

# build polkadot augmented API typings for Phala chain(s)
# e.g. `yarn typegen:from-chain wss://poc4-dev.phala.network/ws`
yarn typegen:from-chain <websocket-endpoint>
```

### Build for production

```sh
yarn build
```

### Run development server

```sh
yarn dev
```
