import { AccountId, BalanceOf } from '@polkadot/types/interfaces'
import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { useApiPromise } from './hooks/useApiPromise'

const BalanceQueryKey = uuidv4()

export function useBalanceQuery(account?: AccountId | string): UseQueryResult<BalanceOf> {
    const { api } = useApiPromise()
    return useQuery([BalanceQueryKey, account, api === undefined], async () =>
        account !== undefined ? (await api?.query.system.account(account))?.data.free : undefined
    )
}
