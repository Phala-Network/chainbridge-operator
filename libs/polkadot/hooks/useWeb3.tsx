import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { createContext, PropsWithChildren, ReactElement, useContext, useEffect, useState } from 'react'
import { useApiPromise } from './useApiPromise'

export type Readystate = 'disabled' | 'enabling' | 'ready' | 'failed'

interface IWeb3Context {
    accounts: InjectedAccountWithMeta[]
    readystate: Readystate
}

const Web3Context = createContext<IWeb3Context>({
    accounts: [],
    readystate: 'disabled',
})

const logDebug = console.debug.bind(console, '[Web3Context]')
const logError = console.error.bind(console, '[Web3Context]')
const logInfo = console.info.bind(console, '[Web3Context]')

export const Web3Provider = ({ children, originName }: PropsWithChildren<{ originName: string }>): ReactElement => {
    const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([])
    const [readystate, setReadystate] = useState<Readystate>('disabled')

    const { api } = useApiPromise()

    useEffect(() => {
        if (readystate === 'ready') {
            return
        }

        const imported = import('@polkadot/extension-dapp').catch((error) => {
            logError('Failed to import @polkadot/extension-dapp:', error)
            throw error
        })

        imported
            .then(({ web3Enable }) => {
                setReadystate('enabling')

                web3Enable(originName)
                    .then((extensions) => {
                        setReadystate('ready')
                        logInfo(
                            'Injected extensions:',
                            extensions.map((ext) => `${ext.name} (${ext.version})`).join(', ')
                        )
                    })
                    .catch((reason) => {
                        setReadystate('failed')
                        logError('Failed to enable web3:', reason)
                    })
            })
            .catch((reason) => {
                logError('Failed to import @polkadot/extension-dapp:', reason)
            })
    })

    useEffect(() => {
        if (readystate !== 'ready') {
            return
        }

        const imported = import('@polkadot/extension-dapp').catch((error) => {
            logError('Failed to import @polkadot/extension-dapp:', error)
            throw error
        })

        const unsub = imported
            .then(async ({ web3AccountsSubscribe }) => {
                const unsub = await web3AccountsSubscribe(
                    (accounts) => {
                        setAccounts(accounts)
                        logInfo('Updated injected accounts:', accounts.map((account) => account.address).join(', '))
                    },
                    { ss58Format: api?.registry.chainSS58 }
                )
                logDebug('Subscribed to account injection updates')
                return unsub
            })
            .catch((error) => {
                /**
                 * NOTE:
                 *      subscription failure doesn't affect core features,
                 *      so we silently reject errors here.
                 *
                 *      however, user may not see any account injection updates.
                 *
                 *      for example, account may not show up,
                 *      while user is not focused on the window and the subscription has failed
                 */
                logError('Failed to subscribe to account injection updates:', error)

                return () => {} // return a dummy unsub func to useEffect unload
            })

        imported
            .then(async ({ web3Accounts }) => {
                const accounts = await web3Accounts({ ss58Format: api?.registry.chainSS58 })
                setAccounts(accounts)
                logInfo('Injected accounts:', accounts.map((account) => account.address).join(', '))
            })
            .catch((error) => {
                logError('Failed to read available accounts:', error)
                throw error
            })

        return () => {
            unsub.then((unsub) => unsub()).catch(() => {})
        }
    }, [api?.registry.chainSS58, readystate])

    return <Web3Context.Provider value={{ accounts, readystate }}>{children}</Web3Context.Provider>
}

export const useWeb3 = (): IWeb3Context => useContext(Web3Context)
