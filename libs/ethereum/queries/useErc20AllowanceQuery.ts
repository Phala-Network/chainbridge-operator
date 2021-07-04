import { BigNumber } from 'ethers'
import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { ethereums } from '../../../config'
import { useErc20Contract } from '../erc20/useErc20Contract'
import { useEthersNetworkQuery } from './useEthersNetworkQuery'

const Erc20AllowanceQueryKey = uuidv4()

export const useErc20AssetHandlerAllowanceQuery = (owner?: string): UseQueryResult<BigNumber> => {
    const { contract, instance } = useErc20Contract()
    const { data: network } = useEthersNetworkQuery()
    const chainId = network?.chainId

    return useQuery([Erc20AllowanceQueryKey, instance, owner], async () => {
        const spender = typeof chainId === 'number' ? ethereums[chainId]?.erc20AssetHandler : undefined

        if (owner === undefined || spender === undefined) {
            return
        }

        const result = (await contract?.functions['allowance']?.(owner, spender)) as BigNumber | BigNumber[] | undefined
        return result instanceof Array ? result[0] : result
    })
}
