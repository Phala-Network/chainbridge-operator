import { ethers } from 'ethers'
import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { useEthers } from '../contexts/useEthers'

const TransactionReceiptQueryKey = uuidv4()

export const useTransactionReceiptQuery = (hash?: string): UseQueryResult<ethers.providers.TransactionReceipt> => {
    const { provider } = useEthers()

    return useQuery([TransactionReceiptQueryKey, hash, provider?.network?.chainId], async () => {
        {
            if (hash !== undefined) {
                const result = await provider?.getTransactionReceipt(hash)
                // TODO: refetch more frequently while not confirmed yet
                return result
            }

            return undefined
        }
    })
}
