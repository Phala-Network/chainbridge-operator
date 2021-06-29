import { ExtrinsicStatus } from '@polkadot/types/interfaces'
import { FormControl } from 'baseui/form-control'
import { Input } from 'baseui/input'
import { Decimal } from 'decimal.js'
import { ethers } from 'ethers'
import React, { useMemo, useState } from 'react'
import { InjectedAccountSelectWithBalanceCaption as EthereumInjectedAccountSelectWithBalanceCaption } from '../components/ethereum/AccountSelect'
import { InjectedAccountSelectWithBalanceCaption as PolkadotInjectedAccountSelectWithBalanceCaption } from '../components/polkadot/AccountSelect'
import { TransferSubmit } from '../components/polkadot/TransferSubmit'
import { useEthereumNetworkOptions } from '../libs/ethereum/queries/useNetworkConfigQuery'
import { useApiPromise } from '../libs/polkadot/hooks/useApiPromise'
import { useDecimalJsTokenDecimalMultiplier } from '../libs/polkadot/useTokenDecimals'
import { bnToDecimal, decimalToBalance } from '../libs/polkadot/utils/balances'

const validAmount = /^\d+(\.(\d+)?)?$/

const TransferToEthereumPage = (): JSX.Element => {
    const [account, setAccount] = useState<string>() // sender
    const [amountInput, setAmountInput] = useState<string>()
    const [recipient, setRecipient] = useState<string>()

    const { api } = useApiPromise()
    const destChainId = useEthereumNetworkOptions()?.destChainId
    const decimals = useDecimalJsTokenDecimalMultiplier(api)

    const handleRecipientChange = (value?: string) => {
        if (value !== undefined) {
            setRecipient(ethers.utils.getAddress(value))
        } else {
            setRecipient(undefined)
        }
    }

    const amount = useMemo(() => {
        return amountInput === undefined ||
            api === undefined ||
            decimals === undefined ||
            !validAmount.test(amountInput)
            ? undefined
            : decimalToBalance(new Decimal(amountInput), decimals, api)
    }, [amountInput, api, decimals])

    const caption = useMemo(() => {
        if (amount !== undefined && decimals !== undefined) {
            return `${bnToDecimal(amount, decimals).toString()} PHA will be transfer to Ethereum network`
        } else {
            return 'Enter a valid amount to be transfer to Ethereum network'
        }
    }, [amount, decimals])

    const [submitError, setSubmitError] = useState<Error>()
    const [submitStatus, setSubmitStatus] = useState<ExtrinsicStatus>()

    return (
        <>
            <>
                <PolkadotInjectedAccountSelectWithBalanceCaption
                    creatable
                    label="From Phala Account"
                    onChange={(account) => setAccount(account)}
                />

                <FormControl label={() => 'Amount'} caption={caption} positive={undefined}>
                    <Input error={amount === undefined} onChange={(e) => setAmountInput(e.currentTarget.value)} />
                </FormControl>

                <EthereumInjectedAccountSelectWithBalanceCaption
                    label="To Ethereum Recipient"
                    onChange={(account) => handleRecipientChange(account)}
                />

                <TransferSubmit
                    amount={amount}
                    destChainId={destChainId}
                    onerror={(error) => setSubmitError(error)}
                    onstatus={(status) => setSubmitStatus(status)}
                    recipient={recipient}
                    sender={account}
                />

                {/* TODO: improve error & status display */}
                {submitError && <>Error: {submitError?.message ?? JSON.stringify(submitError)}</>}
                {submitStatus && <>Status: {submitStatus.toString()}</>}
            </>
        </>
    )
}

export default TransferToEthereumPage
