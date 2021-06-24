import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'
import Web3Modal from 'web3modal'

interface Provider {
    readonly _: unique symbol
}

type Readystate = 'idle' | 'connecting' | 'connected' | 'unavailable'

interface IWeb3Context {
    provider?: Provider
    readystate: Readystate
}

const Web3Context = createContext<IWeb3Context>({ readystate: 'idle' })

export const Web3Provider = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
    const [provider, setProvider] = useState<Provider>()
    const [readystate, setReadystate] = useState<Readystate>('idle')

    const web3Modal = useMemo(
        () =>
            typeof window !== 'undefined'
                ? new Web3Modal({
                      cacheProvider: true,
                      providerOptions: {},
                  })
                : {
                      connect: () => {
                          throw new Error('web3modal is unavailable in SSR')
                      },
                  },
        []
    )

    useEffect(() => {
        if (readystate !== 'idle') {
            return
        }

        setReadystate('connecting')
        web3Modal
            .connect()
            .then((provider) => {
                setReadystate('connected')
                setProvider(provider as Provider)
            })
            .catch(() => {
                setReadystate('unavailable')
            })
    }, [readystate, web3Modal])

    return <Web3Context.Provider value={{ provider, readystate }}>{children}</Web3Context.Provider>
}

export const useWeb3 = (): IWeb3Context => useContext(Web3Context)
