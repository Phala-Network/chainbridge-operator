import { useQuery } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { useApiPromise } from '../hooks/useApiPromise'

const BridgeVoteThresholdQueryKey = uuidv4()

export const useBridgeVoteThresholdQuery = () => {
    const { api } = useApiPromise()
    return useQuery([BridgeVoteThresholdQueryKey, api], async () => {
        return (await api?.query.chainBridge.relayerThreshold())?.toNumber()
    })
}
