import { useEffect, useState } from 'react'
import { useEthers } from '../contexts/useEthers'

export const useAccountsQuery = (): { data?: string[] } => {
    const { provider } = useEthers()

    const [accounts, setAccounts] = useState<string[]>()

    useEffect(() => {
        provider?.listAccounts().then((accounts) => {
            setAccounts(accounts)
        })
    }, [provider])

    return { data: accounts }
}
