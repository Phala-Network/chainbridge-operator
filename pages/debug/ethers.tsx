import { NextPage } from 'next'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { useErc20BalanceQuery } from '../../libs/ethereum/erc20/useErc20BalanceQuery'
import { useAccountsQuery } from '../../libs/ethereum/useAccountsQuery'
import { useEthers } from '../../libs/ethereum/useEthers'
import { ethers, utils as ethersUtils } from 'ethers'

const NetworkQueryKey = uuidv4()

const useNetworkQuery = () => {
    const { instance, provider } = useEthers()
    return useQuery([NetworkQueryKey, instance], async () => await provider?.getNetwork())
}

const BlockNumberQueryKey = uuidv4()

const useBlockNumberQuery = () => {
    const { instance, provider } = useEthers()

    return useQuery([BlockNumberQueryKey, instance], async () => await provider?.getBlockNumber())
}

const AccountRow = ({ account }: { account: string }) => {
    const { data: balance } = useErc20BalanceQuery(account)
    return (
        <>
            {account}: {balance !== undefined ? ethersUtils.formatUnits(balance as ethers.BigNumberish, 18) : 'loading'}{' '}
            PHA
        </>
    )
}

const DebugEthersPage: NextPage = () => {
    const { data: accounts, error: accountQueryError } = useAccountsQuery()
    const { data: blockNumber, dataUpdatedAt } = useBlockNumberQuery()
    const { data: network } = useNetworkQuery()

    const accountRows = useMemo(() => {
        return accounts?.map((account) => <AccountRow account={account} key={account} />) ?? []
    }, [accounts])

    return (
        <>
            <section>
                <h2>Network</h2>
                <ul>
                    <li>Network Name: {network?.name ?? 'unavailable'}</li>
                    <li>Network Chain Id: {network?.chainId ?? 'unavailable'}</li>
                </ul>
                <ul>
                    <li>
                        Block Number: {blockNumber ?? 'unavailble'} (updated at {new Date(dataUpdatedAt).toString()})
                    </li>
                </ul>
            </section>

            <section>
                <h2>Accounts</h2>
                {accountRows}
                {accountQueryError}
            </section>
        </>
    )
}

export default DebugEthersPage
