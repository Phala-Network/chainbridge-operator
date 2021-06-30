import { RegistryTypes } from '@polkadot/types/types'

export interface EthereumNetworkOptions {
    bridge: string
    destChainId: number
    erc20: string
    erc20Handler: string
    erc20DepositResourceId: string
}

export interface PolkadotNetworkOptions {
    endpoint: string
    typedefs: RegistryTypes
}

export type EthereumNetworks = Record<number, EthereumNetworkOptions>
