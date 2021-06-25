import { Contract, ethers } from 'ethers'
import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { networks } from '../../../config'
import { useEthers } from '../contexts/useEthers'
import { useEthersNetworkQuery } from '../queries/useEthersNetworkQuery'

const bridgeInterface = ['function deposit(uint8 destinationChainID, bytes32 resourceID, bytes calldata data)']

export const useBridgeContract = (addressOrName?: string): { contract?: Contract; instance?: string } => {
    const { signer } = useEthers()
    const { data: network } = useEthersNetworkQuery()
    const chainId = network?.chainId

    return useMemo(() => {
        const bridge = addressOrName ?? networks[chainId as number]?.bridge

        if (bridge === undefined || signer === undefined) {
            return {}
        }

        return {
            contract: new ethers.Contract(bridge, bridgeInterface, signer),
            instance: uuidv4(),
        }
    }, [addressOrName, chainId, signer])
}
