import { useMemo } from 'react'
import { ethereums } from '../../../config'
import { EthereumNetworkOptions } from '../../configuration'
import { useEthersNetworkQuery } from './useEthersNetworkQuery'

/**
 * @param chainId Chain Id of destination Ethereum network (e.g Kovan for 42)
 */
export const useEthereumNetworkOptions = (chainId?: number): EthereumNetworkOptions | undefined => {
    const { data: network } = useEthersNetworkQuery()
    chainId = chainId ?? network?.chainId
    return useMemo(() => (typeof chainId === 'number' ? ethereums[chainId] : undefined), [chainId])
}
