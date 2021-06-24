import { ethers, utils as ethersUtils } from 'ethers'
import { NextPage } from 'next'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { useEthers } from '../../libs/ethereum/contexts/useEthers'
import { useAccountsQuery } from '../../libs/ethereum/queries/useAccountsQuery'
import { useErc20AssetHandlerAllowanceQuery } from '../../libs/ethereum/queries/useErc20AllowanceQuery'
import { useErc20BalanceQuery } from '../../libs/ethereum/queries/useErc20BalanceQuery'

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
    const { data: allowance } = useErc20AssetHandlerAllowanceQuery(account)

    return (
        <>
            <h3>{account}</h3>
            <div>
                ERC20 Balance:&nbsp;
                {balance !== undefined ? ethersUtils.formatUnits(balance as ethers.BigNumberish, 18) : 'loading'}
                &nbsp;PHA
            </div>
            <div>
                Allowance:&nbsp;
                {allowance !== undefined ? ethersUtils.formatUnits(allowance as ethers.BigNumberish, 18) : 'loading'}
                &nbsp;PHA
            </div>
        </>
    )
}

const DebugEthersPage: NextPage = () => {
    const { data: accounts, error: accountQueryError } = useAccountsQuery()
    const { data: blockNumber, dataUpdatedAt } = useBlockNumberQuery()
    const { provider } = useEthers()

    const network = useMemo(() => provider?.network, [provider?.network])

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
