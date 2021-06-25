import { ApiPromise } from '@polkadot/api'
import { encodeAddress } from '@polkadot/util-crypto'
import { useMemo } from 'react'

export const useAddressNormalizer = (api?: ApiPromise): ((key: string | Uint8Array) => string) => {
    const ss58 = api?.registry.chainSS58
    return useMemo(() => (key) => encodeAddress(key, ss58), [ss58])
}
