import { isHex } from '@polkadot/util'
import { BigNumber, ethers } from 'ethers'
import { useMemo } from 'react'
import { useEthers } from '../contexts/useEthers'
import { useNetworkConfig } from '../queries/useNetworkConfigQuery'
import { useBridgeContract } from './useBridgeContract'

type Deposit = (amount: BigNumber, recipient: string) => Promise<string> // TODO: use HexString

export const useErc20Deposit = (sender?: string): Deposit | undefined => {
    const { contract } = useBridgeContract()
    const config = useNetworkConfig()
    const { provider } = useEthers()

    const bridge = useMemo(() => {
        return contract !== undefined && provider !== undefined
            ? contract.connect(provider.getSigner(sender))
            : undefined
    }, [contract, provider, sender])

    return useMemo(() => {
        if (bridge === undefined || config === undefined || sender === undefined) {
            return undefined
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

            return await (bridge.functions['deposit'](1, config.erc20DepositResourceId, payload) as Promise<string>)
        }
    }, [bridge, config, sender])
}