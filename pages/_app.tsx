import type { AppProps } from 'next/app'
import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { EthersProvider } from '../libs/ethereum/useEthers'

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
    const client = useMemo(() => new QueryClient(), [])

    return (
        <QueryClientProvider client={client}>
            <EthersProvider>
                <Component {...pageProps} />
            </EthersProvider>
        </QueryClientProvider>
    )
}

export default MyApp
