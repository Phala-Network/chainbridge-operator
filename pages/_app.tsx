import { BaseProvider, LightTheme } from 'baseui'
import { AppNavBar, NavItemT } from 'baseui/app-nav-bar'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/dist/client/router'
import React, { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider as StyletronProvider } from 'styletron-react'
import { polkadot } from '../config'
import { EthersProvider } from '../libs/ethereum/contexts/useEthers'
import { Web3Provider as EthereumWeb3Provider } from '../libs/ethereum/contexts/useWeb3'
import { ApiPromiseProvider } from '../libs/polkadot/hooks/useApiPromise'
import { Web3Provider as PolkadotWeb3Provider } from '../libs/polkadot/hooks/useWeb3'
import { styletron } from '../libs/styletron'

interface NavigationItem extends NavItemT {
    label: string
    navigate: () => void
}

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
    const client = useMemo(() => new QueryClient(), [])

    const { pathname, push } = useRouter()

    const mainItems = useMemo(
        () => [
            {
                active: pathname === '/to-substrate',
                label: 'ERC-20 to Phala',
                navigate: () => {
                    push('/to-substrate').catch(() => {})
                },
            },
            {
                active: pathname === '/to-ethereum',
                label: 'Phala to ERC-20',
                navigate: () => {
                    push('/to-ethereum').catch(() => {})
                },
            },
        ],
        [pathname, push]
    )

    return (
        <QueryClientProvider client={client}>
            <EthereumWeb3Provider>
                <EthersProvider>
                    <PolkadotWeb3Provider originName="ChainBridge operator">
                        <ApiPromiseProvider endpoint={polkadot.endpoint} registryTypes={polkadot.typedefs}>
                            <StyletronProvider value={styletron}>
                                <BaseProvider theme={LightTheme}>
                                    <AppNavBar
                                        mainItems={mainItems}
                                        onMainItemSelect={(item) => {
                                            ;(item as NavigationItem).navigate()
                                        }}
                                    />
                                    <Component {...pageProps} />
                                </BaseProvider>
                            </StyletronProvider>
                        </ApiPromiseProvider>
                    </PolkadotWeb3Provider>
                </EthersProvider>
            </EthereumWeb3Provider>
        </QueryClientProvider>
    )
}

export default MyApp
