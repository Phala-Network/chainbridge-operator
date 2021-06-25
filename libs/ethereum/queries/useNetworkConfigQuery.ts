import { useMemo } from 'react'
import { NetworkConfiguration, networks } from '../../../config'
import { useEthersNetworkQuery } from './useEthersNetworkQuery'

export const useNetworkConfig = (): NetworkConfiguration | undefined => {
    const { data: network } = useEthersNetworkQuery()
    return useMemo(() => networks[network?.chainId as number], [network])
}
