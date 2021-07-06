import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { useBridgeContract } from '../bridge/useBridgeContract'
import { useEthereumNetworkOptions } from './useNetworkConfigQuery'
import { useTransactionReceiptQuery } from './useTransactionReceiptQuery'

const DepositNonceQueryKey = uuidv4()

export const useDepositNonceQuery = (hash?: string): UseQueryResult<number> => {
    const { contract: bridge } = useBridgeContract()
    const ethereum = useEthereumNetworkOptions()

    const { data: receipt } = useTransactionReceiptQuery(hash)

    const depositEventFilter = useMemo(() => {
        return bridge?.filters['Deposit']?.(null, null, null).topics?.[0]
    }, [bridge?.filters])

    return useQuery([DepositNonceQueryKey, receipt, depositEventFilter], () => {
        if (ethereum === undefined || receipt === undefined) {
            return
        }

        const nonces = receipt.logs
            .filter((log) => log.address === ethereum.bridge && log.topics[0] === depositEventFilter)
            .map((log) => BigNumber.from(log.topics[3]).toNumber())

        if (nonces === undefined || nonces.length === 0) {
            // no deposit event found, probably not a bridge transfer
            return undefined
        }

        if (nonces.length !== 1) {
            // one transaction has exact one deposit event
            throw new Error('Unexpected multiple deposit events in one transaction')
        }

        return nonces[0]
    })
}
