import { useEthers } from './useEthers'
import { v4 as uuidv4 } from 'uuid'
import { useQuery, UseQueryResult } from 'react-query'

const AccountQueryKey = uuidv4()

export const useAccountsQuery = (): UseQueryResult<string[]> => {
    const { instance, provider } = useEthers()
    return useQuery([AccountQueryKey, instance], async () => await provider?.listAccounts())
}
