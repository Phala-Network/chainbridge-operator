import { isHex } from '@polkadot/util'
import { BigNumber, ethers } from 'ethers'
import { useMemo } from 'react'
import { useNetworkContext } from '../../polkadot/hooks/useSubstrateNetwork'
import { useEthers } from '../contexts/useEthers'
import { useEthereumNetworkOptions } from '../queries/useEthereumNetworkOptions'
import { useEthersNetworkQuery } from '../queries/useEthersNetworkQuery'
import { useBridgeContract } from './useBridgeContract'

type DepositSubmitFn = (amount: BigNumber, recipient: string) => Promise<ethers.providers.TransactionResponse> // TODO: use HexString

export const useErc20Deposit = (sender?: string): DepositSubmitFn | undefined => {
    const { contract } = useBridgeContract()
    const { options: config } = useEthereumNetworkOptions()
    const { data: network } = useEthersNetworkQuery()
    const { provider } = useEthers()
    const { options: substrate } = useNetworkContext()

    const bridge = useMemo(() => {
        return contract !== undefined && provider !== undefined
            ? contract.connect(provider.getSigner(sender))
            : undefined
    }, [contract, provider, sender])

    return useMemo(() => {
        if (
            bridge === undefined ||
            config === undefined ||
            network === undefined ||
            sender === undefined ||
            substrate === undefined
        ) {
            return undefined
        }

        const destChainId = substrate.destChainIds[network.chainId]

        if (destChainId === undefined) {
            throw new Error(`Unsupported Ethereum network: ${network.name} (${network.chainId})`)
        }

        return async (amount, recipient) => {
            if (typeof bridge.functions['deposit'] !== 'function') {
                throw new Error('Assertion failed: deposit should be available on the bridge contract')
            }

            if (!isHex(recipient)) {
                throw new Error('Validation failed: recipient should be hex string')
            }

            const amountPayload = ethers.utils.hexZeroPad(amount.toHexString(), 32).substr(2)
            const recipientPayload = recipient.substr(2)
            const recipientSize = ethers.utils
                .hexZeroPad(ethers.utils.hexlify(recipientPayload.length / 2), 32)
                .substr(2)

            const payload = `0x${amountPayload}${recipientSize}${recipientPayload}`

            return await (bridge.functions['deposit'](
                destChainId,
                config.erc20ResourceId,
                payload
            ) as Promise<ethers.providers.TransactionResponse>)
        }
    }, [bridge, config, network, sender])
}
