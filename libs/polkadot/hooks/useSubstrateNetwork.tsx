import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { substrates } from '../../../config'
import { SubstrateNetworkOptions } from '../../configuration'

interface INetworkContext {
    /**
     * id of currently currently connected network
     */
    network?: string

    /**
     * network options of currently connected network
     */
    options?: SubstrateNetworkOptions

    /**
     * switch to network {id}
     */
    setNetwork: (id: string) => void
}

const NetworkContext = createContext<INetworkContext>({ setNetwork: () => {} })

export const NetworkContextProvider = ({
    children,
    defaultNetwork,
}: PropsWithChildren<{ defaultNetwork: string }>): JSX.Element => {
    const [network, setNetwork] = useState<string>(defaultNetwork)

    if (substrates[defaultNetwork] === undefined) {
        throw new Error(`Default network ${defaultNetwork} is not configured`)
    }

    const handleSetNetwork = (id: string) => {
        if (substrates[id] === undefined) {
            throw new Error(`Network ${id} is not configured`)
        }

        setNetwork(id)
    }

    useEffect(() => {
        setNetwork(defaultNetwork)
    }, [defaultNetwork])

    const value = {
        network,
        options: substrates[network] as SubstrateNetworkOptions,
        setNetwork: handleSetNetwork,
    }

    return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
}

export const useNetworkContext = (): INetworkContext => useContext(NetworkContext)
