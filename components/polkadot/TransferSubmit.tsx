import { ApiPromise } from '@polkadot/api'
import { BalanceOf, ExtrinsicStatus, Hash } from '@polkadot/types/interfaces'
import { Button } from 'baseui/button'
import { useState } from 'react'
import { useApiPromise } from '../../libs/polkadot/hooks/useApiPromise'
import { waitSignAndSend } from '../../libs/polkadot/utils/signAndSend'

interface TransferSubmitProps {
    amount?: BalanceOf
    destChainId?: number
    recipient?: string
    sender?: string

    onerror?: (error: Error) => void
    onstatus?: (status: ExtrinsicStatus) => void
}

interface SubmitProps extends Required<TransferSubmitProps> {
    api: ApiPromise
}

export const submit = async ({ api, amount, destChainId, onstatus, recipient, sender }: SubmitProps): Promise<Hash> => {
    const { web3FromAddress } = await import('@polkadot/extension-dapp')
    const signer = (await web3FromAddress(sender)).signer
    const extrinsic = api.tx.bridgeTransfer.transferNative(amount, recipient, destChainId)
    return await waitSignAndSend({ account: sender, api, extrinsic, onstatus, signer })
}

export const TransferSubmit = (props: TransferSubmitProps): JSX.Element => {
    const { amount, destChainId, onerror, onstatus, recipient, sender } = props

    const { api } = useApiPromise()

    const [status, setStatus] = useState<ExtrinsicStatus>()

    const handleSubmit = () => {
        if (
            amount === undefined ||
            api === undefined ||
            destChainId === undefined ||
            recipient === undefined ||
            sender === undefined
        ) {
            return
        }

        submit({
            amount,
            api,
            destChainId,
            onerror: onerror ?? (() => {}),
            onstatus: (status) => {
                setStatus(status)
                onstatus?.(status)
            },
            recipient,
            sender,
        }).catch((error) => {
            onerror?.(error)
        })
    }

    return (
        <Button onClick={() => handleSubmit()} isLoading={status !== undefined && !status.isFinalized}>
            Submit
        </Button>
    )
}
