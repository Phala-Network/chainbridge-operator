import { useEffect, useState } from 'react'
import { useEthers } from '../contexts/useEthers'
import { useWeb3 } from '../contexts/useWeb3'

export const useAccountsQuery = (): { data?: string[] } => {
    const { provider } = useEthers()
    const { accounts: web3Accounts } = useWeb3()

    const [accounts, setAccounts] = useState<string[]>()

    useEffect(() => {
        // NOTE: speaks only the accounts available from Ethers to stay consist
        provider?.listAccounts().then((accounts) => {
            setAccounts(accounts)
        })
    }, [provider, web3Accounts])

    // NOTE: there were some legacy shits, so keep accounts in `data` field
    return { data: accounts }
}
