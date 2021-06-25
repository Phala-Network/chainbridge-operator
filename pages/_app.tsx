import { BaseProvider, LightTheme } from 'baseui'
import type { AppProps } from 'next/app'
import React, { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider as StyletronProvider } from 'styletron-react'
import { polkadot } from '../config'
import { EthersProvider } from '../libs/ethereum/contexts/useEthers'
import { Web3Provider as EthereumWeb3Provider } from '../libs/ethereum/contexts/useWeb3'
import { ApiPromiseProvider } from '../libs/polkadot/hooks/useApiPromise'
import { Web3Provider as PolkadotWeb3Provider } from '../libs/polkadot/hooks/useWeb3'
import { styletron } from '../libs/styletron'

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
    const client = useMemo(() => new QueryClient(), [])

    return (
        <QueryClientProvider client={client}>
            <EthereumWeb3Provider>
                <EthersProvider>
                    <PolkadotWeb3Provider originName="ChainBridge operator">
                        <ApiPromiseProvider endpoint={polkadot.endpoint} registryTypes={polkadot.typedefs}>
                            <StyletronProvider value={styletron}>
                                <BaseProvider theme={LightTheme}>
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
