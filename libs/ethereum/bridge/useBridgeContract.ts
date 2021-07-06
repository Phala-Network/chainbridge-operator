import { Contract, ethers } from 'ethers'
import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ethereums } from '../../../config'
import { useEthers } from '../contexts/useEthers'
import { useEthersNetworkQuery } from '../queries/useEthersNetworkQuery'

export const BridgeInterface = [
    'event Deposit(uint8 destinationChainID, bytes32 resourceID, uint64 depositNonce)',
    'function deposit(uint8 destinationChainID, bytes32 resourceID, bytes calldata data)',
]

export const useBridgeContract = (addressOrName?: string): { contract?: Contract; instance?: string } => {
    const { signer } = useEthers()
    const { data: network } = useEthersNetworkQuery()
    const chainId = network?.chainId

    return useMemo(() => {
        const bridge = addressOrName ?? (typeof chainId === 'number' ? ethereums[chainId]?.bridge : undefined)

        if (bridge === undefined || signer === undefined) {
            return {}
        }

        return {
            contract: new ethers.Contract(bridge, BridgeInterface, signer),
            instance: uuidv4(),
        }
    }, [addressOrName, chainId, signer])
}
