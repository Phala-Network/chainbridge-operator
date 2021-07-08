import { dev } from '@phala/typedefs'
import { EthereumNetworkOptions, SubstrateNetworkOptions } from './libs/configuration'

/**
 * Ethereum network is selected via MetaMask and etc.
 * Throws unsupported network on not defined networks in the following table
 */
export const ethereums: Record<number, EthereumNetworkOptions> = {
    42: {
        bridge: '0xe5F54e020f3E4964Ba11D269Cdda602A78d09917',
        destChainId: 0,
        erc20: '0x512f7a3c14b6ee86c2015bc8ac1fe97e657f75f2',
        erc20AssetHandler: '0xDf2E83f33dB8A9CcF3a00FCe18C3F509b974353D',
        erc20ResourceId: '0x00000000000000000000000000000063a7e2be78898ba83824b0c0cc8dfb6001',
    },
}

export const substrates: Record<string, SubstrateNetworkOptions> = {
    'poc4-dev': {
        destChainIds: {
            42: 1,
        },
        endpoint: process.env['PHALA_ENDPOINT'] ?? 'wss://poc4-dev.phala.network/ws',
        typedefs: dev,
    },
}
