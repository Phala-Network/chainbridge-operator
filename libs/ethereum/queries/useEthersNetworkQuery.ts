import type { ethers } from 'ethers'
import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { useEthers } from '../contexts/useEthers'

const EthersNetworkQueryKey = uuidv4()

export const useEthersNetworkQuery = (): UseQueryResult<ethers.providers.Network> => {
    const { instance, provider } = useEthers()

    // TODO: migrate to useMemo, reduce overhead

    return useQuery([EthersNetworkQueryKey, provider?.network, instance], async () => await provider?.getNetwork())
}
