import { LayersManager } from 'baseui/layer'
import type { AppProps } from 'next/app'
import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider as StyletronProvider } from 'styletron-react'
import { EthersProvider } from '../libs/ethereum/contexts/useEthers'
import { Web3Provider } from '../libs/ethereum/contexts/useWeb3'
import { styletron } from '../libs/styletron'

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
    const client = useMemo(() => new QueryClient(), [])

    return (
        <QueryClientProvider client={client}>
            <Web3Provider>
                <EthersProvider>
                    <StyletronProvider value={styletron}>
                        <LayersManager>
                            <Component {...pageProps} />
                        </LayersManager>
                    </StyletronProvider>
                </EthersProvider>
            </Web3Provider>
        </QueryClientProvider>
    )
}

export default MyApp
