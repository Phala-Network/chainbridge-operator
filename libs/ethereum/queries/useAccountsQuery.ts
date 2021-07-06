import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { useEthers } from '../contexts/useEthers'

const AccountQueryKey = uuidv4()

export const useAccountsQuery = (): UseQueryResult<string[]> => {
    const { provider } = useEthers()
    return useQuery([AccountQueryKey, provider?.network], async () => await provider?.listAccounts())
}
