import { RegistryTypes } from '@polkadot/types/types'

export interface EthereumNetworkOptions {
    /**
     * destChainId to call `chainBridge.transferNative` with on Substrate
     */
    destChainId: number

    bridge: string
    erc20: string
    erc20AssetHandler: string
    erc20ResourceId: string
}

export interface SubstrateNetworkOptions {
    /**
     * Map (Ethereum chain id) => (`destChainId` to call `bridge.deposit` with on Ethereum)
     */
    destChainIds: Record<number, number>

    endpoint: string
    typedefs: RegistryTypes
}

export type EthereumNetworks = Record<number, EthereumNetworkOptions>
