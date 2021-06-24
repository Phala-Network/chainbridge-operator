import type { AppProps } from 'next/app'
import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { EthersProvider } from '../libs/ethereum/contexts/useEthers'
import { Web3Provider } from '../libs/ethereum/contexts/useWeb3'

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
    const client = useMemo(() => new QueryClient(), [])

    return (
        <QueryClientProvider client={client}>
            <Web3Provider>
                <EthersProvider>
                    <Component {...pageProps} />
                </EthersProvider>
            </Web3Provider>
        </QueryClientProvider>
    )
}

export default MyApp
