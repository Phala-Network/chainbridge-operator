import { useMemo } from 'react'
import { networks } from '../../../config'
import { EthereumNetworkOptions } from '../../configuration'
import { useEthersNetworkQuery } from './useEthersNetworkQuery'

export const useEthereumNetworkOptions = (): EthereumNetworkOptions | undefined => {
    const { data: network } = useEthersNetworkQuery()
    return useMemo(() => networks[network?.chainId as number], [network])
}
