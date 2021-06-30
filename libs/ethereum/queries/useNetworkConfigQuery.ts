import { useMemo } from 'react'
import { networks } from '../../../config'
import { EthereumNetworkOptions } from '../../configuration'
import { useEthersNetworkQuery } from './useEthersNetworkQuery'

/**
 * @param chainId Chain Id of destination Ethereum network (e.g Kovan for 42)
 */
export const useEthereumNetworkOptions = (chainId?: number): EthereumNetworkOptions | undefined => {
    const { data: network } = useEthersNetworkQuery()
    return useMemo(() => networks[chainId ?? (network?.chainId as number)], [chainId, network?.chainId])
}
