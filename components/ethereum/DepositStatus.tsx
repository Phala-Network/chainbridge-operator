import { Block } from 'baseui/block'
import { StyledLink } from 'baseui/link'
import { PLACEMENT as TooltipPlacement, StatefulTooltip } from 'baseui/tooltip'
import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import React, { useMemo } from 'react'
import { substrate } from '../../config'
import { bigNumberToDecimal } from '../../libs/ethereum/bridge/utils/balances'
import { useDepositNonceQuery } from '../../libs/ethereum/queries/useDepositNonceQuery'
import { useDepositRecordQuery } from '../../libs/ethereum/queries/useDepositRecordQuery'
import { useEthereumNetworkOptions } from '../../libs/ethereum/queries/useEthereumNetworkOptions'
import { useEthersNetworkQuery } from '../../libs/ethereum/queries/useEthersNetworkQuery'
import { useTransactionReceiptQuery } from '../../libs/ethereum/queries/useTransactionReceiptQuery'
import { useBridgeVoteQuery } from '../../libs/polkadot/queries/useBridgeVoteQuery'

dayjs.extend(RelativeTime)

export const DepositStatus = ({ hash }: { hash?: string }): JSX.Element => {
    const { options: ethereum } = useEthereumNetworkOptions()
    const { data: network } = useEthersNetworkQuery()
    const { data: receipt, isLoading: isReceiptLoading, dataUpdatedAt } = useTransactionReceiptQuery(hash)

    const dstChainId = typeof network?.chainId === 'number' ? substrate.destChainIds[network.chainId] : undefined

    const { data: depositNonce, isLoading: isDepositNonceLoading } = useDepositNonceQuery(hash)
    const { data: depositRecord } = useDepositRecordQuery(dstChainId, depositNonce)

    const amount = useMemo(() => bigNumberToDecimal(depositRecord?.amount, 12), [depositRecord?.amount]) // TODO: extract hardcoded decimal factor

    const { data: vote, isLoading: isVoteLoading } = useBridgeVoteQuery({
        amount,
        depositNonce,
        recipient: depositRecord?.destinationRecipientAddress,
        resourceId: depositRecord?.resourceID,
        srcChainId: ethereum?.destChainId,
    })

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

            <p>
                Transfer Id (
                <StatefulTooltip
                    content={<>Bridge Deposit Nonce on Ethereum network</>}
                    placement={TooltipPlacement.bottom}
                    showArrow
                >
                    <StyledLink>?</StyledLink>
                </StatefulTooltip>
                ) : {depositNonce ?? (isDepositNonceLoading ? <i>loading</i> : <i>pending</i>)}
            </p>

            <p>
                Transfer Status (
                <StatefulTooltip
                    content={<>Bridge Transfer Proposal Status on Phala network</>}
                    placement={TooltipPlacement.bottom}
                    showArrow
                >
                    <StyledLink>?</StyledLink>
                </StatefulTooltip>
                ) :&nbsp;
                {vote !== undefined && !vote.isEmpty ? (
                    <>
                        {vote?.status.toString()} ({vote?.votes_for?.length} votes)
                    </>
                ) : isVoteLoading ? (
                    <i>loading</i>
                ) : (
                    <i>pending</i>
                )}
            </p>

            <p>
                <i>updated {dayjs(dataUpdatedAt).fromNow()}</i>
            </p>
        </Block>
    )
}
