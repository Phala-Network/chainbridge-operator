import { Contract, ethers } from 'ethers'
import { useMemo } from 'react'
import { useEthers } from './useEthers'

export const useEthersContract = (
    contractInterface: ethers.ContractInterface,
    addressOrName?: string
): Contract | undefined => {
    const { provider } = useEthers()

    return useMemo(() => {
        if (provider === undefined || addressOrName === undefined) {
            return undefined
        }
        return new ethers.Contract(addressOrName, contractInterface, provider)
    }, [addressOrName, contractInterface, provider])
}
