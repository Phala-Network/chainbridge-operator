import { ethers, Signer } from 'ethers'
import { useContext } from 'react'
import { createContext, PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

type Web3Provider = ethers.providers.Web3Provider

declare global {
    interface Window {
        ethereum?: ethers.providers.ExternalProvider
    }
}

const MetamaskInitializer = () => {
    if (window === undefined || window.ethereum === undefined) {
        throw new Error('Metamask is not injected')
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    return { provider, signer }
}

interface IEthersContext {
    instance?: string
    provider?: Web3Provider
    signer?: Signer
}

const EthersContext = createContext<IEthersContext>({})

export const EthersProvider = ({
    children,
    initializer: initialize,
}: PropsWithChildren<{
    initializer?: () => {
        provider: Web3Provider
        signer: Signer
    }
}>): JSX.Element => {
    const [instance, setInstance] = useState<string>()
    const [provider, setProvider] = useState<Web3Provider>()
    const [signer, setSigner] = useState<Signer>()

    useEffect(() => {
        if (provider !== undefined || signer !== undefined) {
            return
        }

        const { provider: newProvider, signer: newSigner } = (initialize ?? MetamaskInitializer)()
        setInstance(uuidv4())
        setProvider(newProvider)
        setSigner(newSigner)
    }, [initialize, provider, signer])

    return <EthersContext.Provider value={{ instance, provider, signer }}>{children}</EthersContext.Provider>
}

export const useEthers = (): IEthersContext => useContext(EthersContext)
