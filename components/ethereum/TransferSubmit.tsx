import { Button } from 'baseui/button'
import { BigNumber } from 'ethers'
import { useErc20Deposit } from '../../libs/ethereum/bridge/deposit'

export const TransferSubmit = ({
    amount,
    disabled,
    recipient,
    sender,
}: {
    amount?: BigNumber
    disabled?: boolean
    recipient?: string
    sender?: string
}): JSX.Element => {
    const deposit = useErc20Deposit(sender)

    const startDeposit = () => {
        if (deposit === undefined || amount === undefined || recipient === undefined) {
            return
        }

        deposit(amount, recipient)
            .then((tx) => console.info('Transaction:', tx))
            .catch((error) => console.error('Transaction failed:', error))
    }

    return (
        <Button onClick={() => startDeposit()} disabled={disabled === true || typeof deposit !== 'function'}>
            Submit
        </Button>
    )
}
