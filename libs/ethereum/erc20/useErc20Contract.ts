import { Contract, ethers } from 'ethers'
import { useMemo } from 'react'
import { useEthers } from '../useEthers'

const contractInterface = [
    'function allowance(address owner, address spender) external view returns (uint256)',
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function balanceOf(address account) external view returns (uint256)',
]

export const useErc20Contract = (addressOrName?: string): Contract | undefined => {
    const { signer } = useEthers()

    return useMemo(() => {
        if (addressOrName === undefined || signer === undefined) {
            return undefined
        }

        return new ethers.Contract(addressOrName, contractInterface, signer)
    }, [addressOrName, signer])
}
