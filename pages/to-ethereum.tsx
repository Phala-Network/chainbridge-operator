import { FormControl } from 'baseui/form-control'
import { Input } from 'baseui/input'
import { Decimal } from 'decimal.js'
import { ethers } from 'ethers'
import React, { useMemo, useState } from 'react'
import { InjectedAccountSelectWithBalanceCaption as EthereumInjectedAccountSelectWithBalanceCaption } from '../components/ethereum/AccountSelect'
import { InjectedAccountSelectWithBalanceCaption as PolkadotInjectedAccountSelectWithBalanceCaption } from '../components/polkadot/AccountSelect'
import { useApiPromise } from '../libs/polkadot/hooks/useApiPromise'
import { useDecimalJsTokenDecimalMultiplier } from '../libs/polkadot/useTokenDecimals'
import { bnToDecimal, decimalToBalance } from '../libs/polkadot/utils/balances'

const validAmount = /^\d+(\.(\d+)?)?$/

const TransferToEthereumPage = (): JSX.Element => {
    const [, setAccount] = useState<string>()
    const [amountInput, setAmountInput] = useState<string>()
    const [, setRecipient] = useState<string>()

    const { api } = useApiPromise()
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

                {/* TODO: submit button goes here */}
            </>
        </>
    )
}

export default TransferToEthereumPage
