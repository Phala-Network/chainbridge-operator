import type { ethers } from 'ethers'
import { useQuery, UseQueryResult } from 'react-query'
import { useEthers } from '../contexts/useEthers'
import { v4 as uuidv4 } from 'uuid'

const EthersNetworkQueryKey = uuidv4()

export const useEthersNetworkQuery = (): UseQueryResult<ethers.providers.Network> => {
    const { instance, provider } = useEthers()

    return useQuery([EthersNetworkQueryKey, provider?.network, instance], async () => await provider?.getNetwork())
}
