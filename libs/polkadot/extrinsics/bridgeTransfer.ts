import { ApiPromise } from '@polkadot/api'
import { BalanceOf, ExtrinsicStatus, Hash } from '@polkadot/types/interfaces'
import { useMemo } from 'react'
import { useEthereumNetworkOptions } from '../../ethereum/queries/useEthereumNetworkOptions'
import { useApiPromise } from '../hooks/useApiPromise'
import { waitSignAndSend } from '../utils/signAndSend'

interface TransferProps {
    amount: BalanceOf
    api: ApiPromise
    destChainId: number
    recipient: string
    sender: string

    onstatus?: (status: ExtrinsicStatus) => void
}

export const transfer = async ({
    amount,
    api,
    destChainId,
    onstatus,
    recipient,
    sender,
}: TransferProps): Promise<Hash> => {
    const web3FromAddress = (await import('@polkadot/extension-dapp')).web3FromAddress

    const signer = (await web3FromAddress(sender)).signer
    const extrinsic = api.tx.bridgeTransfer.transferNative(amount, recipient, destChainId)

    return await waitSignAndSend({ account: sender, api, extrinsic, onstatus, signer })
}

type TransferSubmit = (
    amount: BalanceOf,
    recipient: string,
    sender: string,
    onstatus?: (status: ExtrinsicStatus) => void
) => Promise<Hash>

/**
 * @param chainId Chain Id of destination Ethereum network (e.g Kovan for 42)
 */
export const useTransferSubmit = (chainId?: number): TransferSubmit | undefined => {
    const { api } = useApiPromise()
    const destChainId = useEthereumNetworkOptions(chainId).options?.destChainId

    return useMemo(() => {
        if (api === undefined || destChainId === undefined) {
            return undefined
        }

        return async (
            amount: BalanceOf,
            recipient: string,
            sender: string,
            onstatus?: (status: ExtrinsicStatus) => void
        ): Promise<Hash> => {
            return await transfer({ amount, api, destChainId, onstatus, recipient, sender })
        }
    }, [api, destChainId])
}
