import { Block } from 'baseui/block'
import { StyledLink } from 'baseui/link'
import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import { BigNumber } from 'ethers'
import React, { useMemo } from 'react'
import { useBridgeContract } from '../../libs/ethereum/bridge/useBridgeContract'
import { useEthereumNetworkOptions } from '../../libs/ethereum/queries/useNetworkConfigQuery'
import { useTransactionReceiptQuery } from '../../libs/ethereum/queries/useTransactionReceiptQuery'

dayjs.extend(RelativeTime)

export const DepositStatus = ({ hash }: { hash?: string }): JSX.Element => {
    const { contract } = useBridgeContract()
    const network = useEthereumNetworkOptions()
    const { data: receipt, isLoading: isReceiptLoading, dataUpdatedAt } = useTransactionReceiptQuery(hash)

    const depositMatcher = useMemo(
        () => contract?.filters['Deposit']?.(null, null, null).topics?.[0],
        [contract?.filters]
    )

    const depositNonce = useMemo(() => {
        const nonces = receipt?.logs
            .filter((log) => log.address === network?.bridge && log.topics[0] === depositMatcher)
            .map((log) => BigNumber.from(log.topics[3]).toNumber())

        if (nonces === undefined || nonces.length === 0) {
            // no deposit event found, probably not a bridge transfer
            return undefined
        }

        if (nonces.length !== 1) {
            // one transaction has exact one deposit event
            throw new Error('Unexpected multiple deposit events in one transaction')
        }

        return nonces[0]
    }, [depositMatcher, network?.bridge, receipt?.logs])

    return (
        <Block>
            <p>
                Transaction Hash:&nbsp;
                <StyledLink
                    href="#"
                    onClick={() => {
                        hash !== undefined && navigator.clipboard.writeText(hash).catch(() => {})
                    }}
                >
                    {hash}
                </StyledLink>
                &nbsp;
                {isReceiptLoading ? (
                    <i>(loading status from Ethereum)</i>
                ) : typeof receipt?.confirmations === 'number' && receipt.confirmations > 0 ? (
                    <i>({receipt.confirmations} block confirmations)</i>
                ) : (
                    <i>(pending for confirmations)</i>
                )}
            </p>

            <p>Bridge Transfer Nonce: {depositNonce ?? <i>Pending</i>}</p>

            <p>
                <i>updated {dayjs(dataUpdatedAt).fromNow()}</i>
            </p>
        </Block>
    )
}
