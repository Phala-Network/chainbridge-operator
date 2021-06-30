import { ExtrinsicStatus, Hash } from '@polkadot/types/interfaces'
import { Button } from 'baseui/button'
import { FormControl } from 'baseui/form-control'
import { Input } from 'baseui/input'
import { StyledLink } from 'baseui/link'
import { KIND as NotificationKind, Notification } from 'baseui/notification'
import { Decimal } from 'decimal.js'
import { getAddress, isAddress } from 'ethers/lib/utils'
import React, { useMemo, useState } from 'react'
import { InjectedAccountSelectWithBalanceCaption as EthereumInjectedAccountSelectWithBalanceCaption } from '../components/ethereum/AccountSelect'
import { InjectedAccountSelectWithBalanceCaption as PolkadotInjectedAccountSelectWithBalanceCaption } from '../components/polkadot/AccountSelect'
import { ExtrinsicStatusIndicator } from '../components/polkadot/ExtrinsicStatusIndicator'
import { useTransferSubmit } from '../libs/polkadot/extrinsics/bridgeTransfer'
import { useApiPromise } from '../libs/polkadot/hooks/useApiPromise'
import { useDecimalJsTokenDecimalMultiplier } from '../libs/polkadot/useTokenDecimals'
import { bnToDecimal, decimalToBalance } from '../libs/polkadot/utils/balances'
const validAmount = /^\d+(\.(\d+)?)?$/

const TransferToEthereumPage = (): JSX.Element => {
    const { api } = useApiPromise()
    const decimals = useDecimalJsTokenDecimalMultiplier(api)
    const submit = useTransferSubmit(/* NOTE: pass destination Ethereum network Id here to override */)

    const [account, setAccount] = useState<string>() // sender
    const [amountInput, setAmountInput] = useState<string>()
    const [recipient, setRecipient] = useState<string>()

    const amount = useMemo(() => {
        return amountInput === undefined ||
            api === undefined ||
            decimals === undefined ||
            !validAmount.test(amountInput)
            ? undefined
            : decimalToBalance(new Decimal(amountInput), decimals, api)
    }, [amountInput, api, decimals])

    const handleRecipientChange = (value?: string) => {
        if (value !== undefined && isAddress(value)) {
            setRecipient(getAddress(value))
        } else {
            setRecipient(undefined)
        }
    }

    const caption = useMemo(() => {
        if (amount !== undefined && decimals !== undefined) {
            return `${bnToDecimal(amount, decimals).toString()} PHA will be transfer to Ethereum network`
        } else {
            return 'Enter a valid amount to be transfer to Ethereum network'
        }
    }, [amount, decimals])

    /* submission-related */

    const [submitError, setSubmitError] = useState<Error>()
    const [submitStatus, setSubmitStatus] = useState<ExtrinsicStatus>()
    const [submittedHash, setSubmittedHash] = useState<Hash>()
    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const ready = useMemo(
        () => account !== undefined && amount !== undefined && recipient !== undefined && !isSubmitting,
        [account, amount, isSubmitting, recipient]
    )

    const handleSubmit = () => {
        if (account === undefined || amount === undefined || recipient === undefined) {
            return
        }

        setSubmitError(undefined)
        setSubmitStatus(undefined)
        setSubmittedHash(undefined)
        setSubmitting(true)

        submit?.(amount, recipient, account, (status) => setSubmitStatus(status))
            .then((hash) => setSubmittedHash(hash))
            .catch((error) => setSubmitError(error))
            .finally(() => setSubmitting(false))
    }

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

                <Button
                    onClick={() => handleSubmit()}
                    disabled={!ready && !isSubmitting}
                    isLoading={(submitStatus !== undefined && !submitStatus.isFinalized) || isSubmitting}
                >
                    Submit
                </Button>

                {submitError && (
                    <Notification kind={NotificationKind.negative} overrides={{ Body: { style: { width: 'auto' } } }}>
                        {submitError?.message ?? JSON.stringify(submitError)}
                    </Notification>
                )}

                {submitStatus && !submitStatus.isFinalized && (
                    <Notification kind={NotificationKind.info} overrides={{ Body: { style: { width: 'auto' } } }}>
                        <ExtrinsicStatusIndicator status={submitStatus} />
                    </Notification>
                )}

                {submittedHash && (
                    <Notification kind={NotificationKind.positive} overrides={{ Body: { style: { width: 'auto' } } }}>
                        Transaction Hash: <StyledLink href="#">{submittedHash.toHex()}</StyledLink>
                    </Notification>
                )}
            </>
        </>
    )
}
export default TransferToEthereumPage
