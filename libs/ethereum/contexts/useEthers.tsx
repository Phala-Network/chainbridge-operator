import { ethers, Signer } from 'ethers'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Readystate, useWeb3 } from './useWeb3'

type ExternalProvider = ethers.providers.ExternalProvider
type Web3Provider = ethers.providers.Web3Provider

interface IEthersContext {
    instance?: string
    provider?: Web3Provider
    readystate: Readystate
    signer?: Signer
}

const EthersContext = createContext<IEthersContext>({ readystate: 'unavailable' })

export const EthersProvider = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
    const { provider: externalProvider, readystate } = useWeb3()

    const provider = useMemo(
        () =>
            externalProvider !== undefined
                ? new ethers.providers.Web3Provider(externalProvider as ExternalProvider)
                : undefined,
        [externalProvider]
    )
    const signer = useMemo(() => provider?.getSigner(), [provider])
    const instance = useMemo(() => (provider !== undefined ? uuidv4() : undefined), [provider])

    // TODO: use ethers.fallbackprovider as provider

    return (
        <EthersContext.Provider value={{ instance, provider, readystate, signer }}>{children}</EthersContext.Provider>
    )
}

export const useEthers = (): IEthersContext => useContext(EthersContext)
