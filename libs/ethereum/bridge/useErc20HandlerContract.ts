import { Contract, ethers } from 'ethers'
import { useMemo } from 'react'
import { ethereums } from '../../../config'
import { useEthers } from '../contexts/useEthers'
import { useEthersNetworkQuery } from '../queries/useEthersNetworkQuery'
import abi from './Erc20HandlerAbi.json'

export const useErc20HandlerInterface = (addressOrName?: string): { contract?: Contract; instance?: string } => {
    const { signer } = useEthers()
    const { data: network } = useEthersNetworkQuery()
    const chainId = network?.chainId

    return useMemo(() => {
        const handler = addressOrName ?? ethereums[chainId as number]?.erc20AssetHandler

        if (handler === undefined || signer === undefined) {
            return {}
        }

        return {
            contract: new ethers.Contract(handler, abi, signer),
        }
    }, [addressOrName, chainId, signer])
}
