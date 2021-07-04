import { Contract, ethers } from 'ethers'
import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ethereums } from '../../../config'
import { useEthers } from '../contexts/useEthers'
import { useEthersNetworkQuery } from '../queries/useEthersNetworkQuery'

const contractInterface = [
    'function allowance(address owner, address spender) external view returns (uint256)',
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function balanceOf(address account) external view returns (uint256)',
]

export const useErc20Contract = (addressOrName?: string): { contract?: Contract; instance?: string } => {
    const { signer } = useEthers()
    const { data: network } = useEthersNetworkQuery()
    const chainId = network?.chainId

    return useMemo(() => {
        const erc20 = addressOrName ?? (typeof chainId === 'number' ? ethereums[chainId]?.erc20 : undefined)

        if (erc20 === undefined || signer === undefined) {
            return {}
        }

        return {
            contract: new ethers.Contract(erc20, contractInterface, signer),
            instance: uuidv4(),
        }
    }, [addressOrName, chainId, signer])
}
