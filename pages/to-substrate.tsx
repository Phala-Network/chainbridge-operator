import { u8aToHex } from '@polkadot/util'
import { decodeAddress } from '@polkadot/util-crypto'
import { FormControl } from 'baseui/form-control'
import { Input } from 'baseui/input'
import { KIND as NotificationKind, Notification } from 'baseui/notification'
import { BigNumber, ethers } from 'ethers'
import React, { useMemo, useState } from 'react'
import { InjectedAccountSelectWithBalanceCaption as EthereumInjectedAccountSelectWithBalanceCaption } from '../components/ethereum/AccountSelect'
import { AllowanceApprove } from '../components/ethereum/AllowanceGrant'
import { TransferSubmit } from '../components/ethereum/TransferSubmit'
import { InjectedAccountSelect as PolkadotInjectedAccountSelect } from '../components/polkadot/AccountSelect'
import { useErc20AssetHandlerAllowanceQuery } from '../libs/ethereum/queries/useErc20AllowanceQuery'

const validAmount = /^\d+(\.(\d+)?)?$/

const TransferToSubstratePage = (): JSX.Element => {
    const [account, setAccount] = useState<string>()
    const [amount, setAmount] = useState<BigNumber>()
    const [recipient, setRecipient] = useState<string>()
    const { data: allowance } = useErc20AssetHandlerAllowanceQuery(account)

    const isAllowanceEnough = useMemo(
        () => amount !== undefined && allowance?.gte(amount) === true,
        [allowance, amount]
    )

    const handleAmountChange = (value: string) => {
        if (validAmount.test(value)) {
            setAmount(ethers.utils.parseUnits(value, 18))
        } else {
            setAmount(undefined)
        }
    }

    const handleRecipientChange = (value?: string) => {
        try {
            setRecipient(u8aToHex(decodeAddress(value)))
        } catch {
            setRecipient(undefined)
        }
    }

    const caption = useMemo(() => {
        if (amount !== undefined) {
            return `${ethers.utils.formatUnits(amount, 18)} PHA will be transfer to Phala`
        } else {
            return 'Enter a valid amount to be transfer to Phala chain'
        }
    }, [amount])

    return (
        <>
            <EthereumInjectedAccountSelectWithBalanceCaption
                label="From Ethereum Account"
                onChange={(account) => setAccount(account)}
            />

            <FormControl label={() => 'Amount'} caption={caption} positive={undefined}>
                <Input error={amount === undefined} onChange={(e) => handleAmountChange(e.currentTarget.value)} />
            </FormControl>

            <PolkadotInjectedAccountSelect
                label="To Phala Recipient"
                onChange={(account) => handleRecipientChange(account)}
            />

            <TransferSubmit amount={amount} disabled={!isAllowanceEnough} recipient={recipient} sender={account} />

            {account !== undefined && !isAllowanceEnough && amount !== undefined && (
                <Notification kind={NotificationKind.negative} overrides={{ Body: { style: { width: '100%' } } }}>
                    You have to approve our bridge before transfering.
                    <AllowanceApprove owner={account} value={amount} />
                </Notification>
            )}
        </>
    )
}

export default TransferToSubstratePage
