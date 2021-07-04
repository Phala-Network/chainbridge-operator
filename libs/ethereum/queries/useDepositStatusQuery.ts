import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { substrate } from '../../../config'
import { useErc20HandlerInterface } from '../bridge/useErc20HandlerContract'
import { useDepositNonceQuery } from './useDepositNonceQuery'
import { useEthersNetworkQuery } from './useEthersNetworkQuery'
import { useEthereumNetworkOptions } from './useNetworkConfigQuery'
import { useTransactionReceiptQuery } from './useTransactionReceiptQuery'

const DepositStatusQueryKey = uuidv4()

export const useDepositStatusQuery = (hash?: string): UseQueryResult<unknown> => {
    const { contract: handler } = useErc20HandlerInterface()
    const ethereum = useEthereumNetworkOptions()
    const { data: network } = useEthersNetworkQuery()

    const { data: receipt } = useTransactionReceiptQuery(hash)
    const { data: nonce } = useDepositNonceQuery(hash)

    return useQuery([DepositStatusQueryKey], async () => {
        if (
            ethereum === undefined ||
            handler === undefined ||
            network === undefined ||
            nonce === undefined ||
            receipt === undefined
        ) {
            return
        }

        const destChainId = substrate.destChainIds[network.chainId]

        if (destChainId) {
            throw new Error(`Unsupported Ethereum network: ${network.name} (${network.chainId})`)
        }

        const record = (await handler?.functions['getDepositRecord']?.(nonce, destChainId)) as unknown

        return {
            record,
        }
    })
}
