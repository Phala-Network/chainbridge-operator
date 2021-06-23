import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { networks } from '../../../config'
import { useEthers } from '../useEthers'
import { useErc20Contract } from './useErc20Contract'

const Erc20BalanceQuery = uuidv4()

export const useErc20BalanceQuery = (account: string): UseQueryResult => {
    const { provider } = useEthers()

    const chainId = provider?.network?.chainId
    const erc20 = useMemo(() => {
        return typeof chainId === 'number' ? networks[chainId]?.erc20 : undefined
    }, [chainId])
    const contract = useErc20Contract(erc20)

    return useQuery([Erc20BalanceQuery, chainId, erc20, account], async () => {
        const result = (await contract?.functions['balanceOf']?.(account)) as BigNumber | BigNumber[] | undefined
        if (result instanceof Array) {
            return result[0]
        } else {
            return result
        }
    })
}
