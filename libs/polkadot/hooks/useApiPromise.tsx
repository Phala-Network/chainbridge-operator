import { ApiPromise, WsProvider } from '@polkadot/api'
import { PropsWithChildren, ReactElement, createContext, useContext, useEffect, useState } from 'react'
import { RegistryTypes } from '@polkadot/types/types'

type Readystate = 'unavailable' | 'init' | 'ready' | 'failed'

interface IApiPromiseContext {
    api?: ApiPromise
    readystate: Readystate
}

const ApiPromiseContext = createContext<IApiPromiseContext>({
    readystate: 'unavailable',
})

const logDebug = console.debug.bind(console, '[ApiPromiseContext]')
const logError = console.error.bind(console, '[ApiPromiseContext]')

const enableApiPromise = async (endpoint: string, types: RegistryTypes): Promise<ApiPromise> => {
    const { cryptoWaitReady } = await import('@polkadot/util-crypto')
    await cryptoWaitReady()
    logDebug('Polkadot crypto is ready')

    const { ApiPromise } = await import('@polkadot/api')
    const api = await ApiPromise.create({
        provider: new WsProvider(endpoint),
        types,
    })
    logDebug('WebSocket API is ready:', api.runtimeVersion)

    return api
}

export const ApiPromiseProvider = ({
    children,
    endpoint,
    registryTypes,
}: PropsWithChildren<{
    endpoint: string
    registryTypes: RegistryTypes
}>): ReactElement => {
    const [api, setApi] = useState<ApiPromise>()
    const [readystate, setState] = useState<Readystate>('unavailable')

    useEffect(() => {
        if (typeof window === 'undefined' || readystate !== 'unavailable') {
            // do not enable during server side rendering
            return
        }

        setState('init')

        enableApiPromise(endpoint, registryTypes)
            .then((api) => {
                setApi(api)
                setState('ready')
            })
            .catch((reason) => {
                logError('Failed to enable Polkadot API:', reason)
                setState('failed')
            })
    }, [endpoint, readystate, registryTypes])

    const value = { api, readystate }

    return <ApiPromiseContext.Provider value={value}>{children}</ApiPromiseContext.Provider>
}

export const useApiPromise = (): IApiPromiseContext => useContext(ApiPromiseContext)
