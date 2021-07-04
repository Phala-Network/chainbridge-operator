import { Decimal } from 'decimal.js'
import { BigNumber } from 'ethers'

export function bigNumberToDecimal(amount?: BigNumber, decimals?: number): Decimal | undefined {
    if (amount === undefined || decimals === undefined) {
        return
    }

    return new Decimal(amount.toString()).div(new Decimal(10).pow(decimals))
}
