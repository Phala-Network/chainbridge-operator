import { BigNumber } from 'ethers'
import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { useErc20HandlerInterface } from '../bridge/useErc20HandlerContract'
import { useEthersNetworkQuery } from './useEthersNetworkQuery'

interface DepositHandlerContract {
    getDepositRecord: (nonce: number, destChainId: number) => Promise<unknown[]>
}

interface DepositRecord {
    tokenAddress: string
    destinationChainID: number
    resourceID: string
    destinationRecipientAddress: string
    depositer: string
    amount: BigNumber
}

const DepositRecordQueryKey = uuidv4()

export const useDepositRecordQuery = (destChainId?: number, nonce?: number): UseQueryResult<DepositRecord> => {
    const { contract: handler } = useErc20HandlerInterface()
    const { data: network } = useEthersNetworkQuery()

    return useQuery([DepositRecordQueryKey, destChainId, nonce, network?.chainId], async () => {
        if (destChainId === undefined || network === undefined || nonce === undefined) {
            return
        }

        const result = await (handler as unknown as DepositHandlerContract).getDepositRecord(nonce, destChainId)

        return result !== undefined
            ? {
                  tokenAddress: result[0] as string,
                  destinationChainID: result[2] as number,
                  resourceID: result[3] as string,
                  destinationRecipientAddress: result[4] as string,
                  depositer: result[5] as string,
                  amount: result[6] as BigNumber,
              }
            : undefined
    })
}
