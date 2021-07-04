import { Option } from '@polkadot/types'
import { AccountId } from '@polkadot/types/interfaces'
import { hexToU8a } from '@polkadot/util'
import { decodeAddress } from '@polkadot/util-crypto'
import { Decimal } from 'decimal.js'
import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { useApiPromise } from '../hooks/useApiPromise'
import { ProposalVotes } from '../interfaces'
import { useDecimalJsTokenDecimalMultiplier } from '../useTokenDecimals'
import { decimalToBalance } from '../utils/balances'

const BridgeVoteQueryKey = uuidv4()

export const useBridgeVoteQuery = ({
    amount: decimalAmount,
    depositNonce: numberNonce,
    recipient,
    resourceId,
    srcChainId,
}: {
    amount?: Decimal
    depositNonce?: number
    recipient?: AccountId | string
    resourceId?: string
    srcChainId?: number
}): UseQueryResult<ProposalVotes> => {
    const { api } = useApiPromise()
    const tokenDecimals = useDecimalJsTokenDecimalMultiplier(api)

    return useQuery([BridgeVoteQueryKey, srcChainId, numberNonce], async () => {
        if (decimalAmount === undefined || api === undefined || tokenDecimals === undefined) {
            return
        }

        const call = api.registry.createType('Call', {
            args: [
                decodeAddress(recipient),
                decimalToBalance(decimalAmount, tokenDecimals, api),
                hexToU8a(resourceId, 256),
            ],
            callIndex: api.tx.bridgeTransfer.transfer.callIndex,
        })

        const result = (await api.query.chainBridge.votes(srcChainId, [numberNonce, call])) as Option<ProposalVotes>
        return result.unwrapOr(undefined)
    })
}
