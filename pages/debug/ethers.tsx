import { NextPage } from 'next'
import { useQuery } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { useEthers } from '../../libs/ethereum/useEthers'

const NetworkQueryKey = uuidv4()

const useNetworkQuery = () => {
    const { instance, provider } = useEthers()
    return useQuery([NetworkQueryKey, instance], async () => await provider?.getNetwork())
}

const BlockNumberQueryKey = uuidv4()

const useBlockNumberQuery = () => {
    const { instance, provider } = useEthers()

    return useQuery([BlockNumberQueryKey, instance], async () => await provider?.getBlockNumber())
}

const DebugEthersPage: NextPage = () => {
    const { data: network } = useNetworkQuery()
    const { data: blockNumber, dataUpdatedAt } = useBlockNumberQuery()

    return (
        <>
            <ul>
                <li>Network Name: {network?.name ?? 'unavailable'}</li>
                <li>Network Chain Id: {network?.chainId ?? 'unavailable'}</li>
            </ul>
            <ul>
                <li>
                    Block Number: {blockNumber ?? 'unavailble'} (updated at {new Date(dataUpdatedAt).toString()})
                </li>
            </ul>
        </>
    )
}

export default DebugEthersPage
