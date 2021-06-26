import { ApiPromise } from '@polkadot/api'
import { Balance } from '@polkadot/types/interfaces'
import BN from 'bn.js'
import { Decimal } from 'decimal.js'

export function decimalToBN(decimal: Decimal, tokenDecimals: Decimal): BN
export function decimalToBN(decimal: Decimal, tokenDecimals?: Decimal): BN | undefined {
    return tokenDecimals !== undefined ? new BN(tokenDecimals.mul(decimal).toString()) : undefined
}

export function bnToBalance(bn: BN, api: ApiPromise): Balance
export function bnToBalance(bn: BN, api?: ApiPromise): Balance | undefined {
    return api?.registry.createType('Balance', bn)
}

export function decimalToBalance(decimal: Decimal, tokenDecimals: Decimal, api: ApiPromise): Balance
export function decimalToBalance(decimal: Decimal, tokenDecimals?: Decimal, api?: ApiPromise): Balance | undefined {
    if (api === undefined || tokenDecimals === undefined) { return undefined }

    return bnToBalance(decimalToBN(decimal, tokenDecimals), api)
}

export function bnToDecimal(bn: BN, tokenDecimals: Decimal): Decimal
export function bnToDecimal(bn?: BN, tokenDecimals?: Decimal): Decimal | undefined {
    if (bn === undefined || tokenDecimals === undefined) { return undefined }

    return new Decimal(bn.toString()).div(tokenDecimals)
}
