import { ApiPromise } from '@polkadot/api'
import { Decimal } from 'decimal.js'
import { useMemo } from 'react'

function getTokenDecimals(api?: ApiPromise): number | undefined {
    const tokenDecimals = api?.registry.getChainProperties()?.tokenDecimals.toJSON() as number[] | undefined
    return tokenDecimals?.[0]
}

export const useTokenDecimals = (api?: ApiPromise): number | undefined => {
    return useMemo(() => getTokenDecimals(api), [api])
}

export const useDecimalJsTokenDecimalMultiplier = (api?: ApiPromise): Decimal | undefined => {
    const decimals = useTokenDecimals(api)
    return decimals !== undefined ? new Decimal(10).pow(decimals) : undefined
}
