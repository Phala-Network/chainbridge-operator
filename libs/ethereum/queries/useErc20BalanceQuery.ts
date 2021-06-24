import { BigNumber } from 'ethers'
import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { useErc20Contract } from '../erc20/useErc20Contract'

const Erc20BalanceQuery = uuidv4()

export const useErc20BalanceQuery = (account?: string): UseQueryResult => {
    const { contract, instance } = useErc20Contract()

    return useQuery([Erc20BalanceQuery, instance, account], async () => {
        if (account === undefined) {
            return
        }

        const result = (await contract?.functions['balanceOf']?.(account)) as BigNumber | BigNumber[] | undefined
        return result instanceof Array ? result[0] : result
    })
}
