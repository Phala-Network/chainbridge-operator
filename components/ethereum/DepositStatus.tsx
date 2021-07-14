import { Block } from 'baseui/block'
import { StyledLink } from 'baseui/link'
import { PLACEMENT as TooltipPlacement, StatefulTooltip } from 'baseui/tooltip'
import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import React, { useMemo } from 'react'
import { bigNumberToDecimal } from '../../libs/ethereum/bridge/utils/balances'
import { useDepositNonceQuery } from '../../libs/ethereum/queries/useDepositNonceQuery'
import { useDepositRecordQuery } from '../../libs/ethereum/queries/useDepositRecordQuery'
import { useEthereumNetworkOptions } from '../../libs/ethereum/queries/useEthereumNetworkOptions'
import { useEthersNetworkQuery } from '../../libs/ethereum/queries/useEthersNetworkQuery'
import { useTransactionReceiptQuery } from '../../libs/ethereum/queries/useTransactionReceiptQuery'
import { useNetworkContext } from '../../libs/polkadot/hooks/useSubstrateNetwork'
import { useBridgeVoteQuery } from '../../libs/polkadot/queries/useBridgeVoteQuery'
import { useBridgeVoteThresholdQuery } from '../../libs/polkadot/queries/useBridgeVoteThresholdQuery'

dayjs.extend(RelativeTime)

/**
 * Status tracking widget of transfers from Ethereum to Substrate
 */
export const DepositStatus = ({ hash }: { hash?: string }): JSX.Element => {
    const { network: substrateName, options: substrateOptions } = useNetworkContext()
    const { data: ethereum } = useEthersNetworkQuery()
    const { options: ethereumOptions } = useEthereumNetworkOptions()

    const { data: receipt, isLoading: isReceiptLoading, dataUpdatedAt } = useTransactionReceiptQuery(hash)

    /**
     * destChainId from the view on Ethereum
     */
    const destChainId = ethereumOptions?.peerChainIds[substrateName as string]

    /**
     * originChainId from the view on Substrate
     */
    const originChainId = substrateOptions?.peerChainIds[ethereum?.chainId as number]

    const { data: depositNonce, isLoading: isDepositNonceLoading } = useDepositNonceQuery(hash)
    const { data: depositRecord } = useDepositRecordQuery(destChainId, depositNonce)

    const amount = useMemo(() => bigNumberToDecimal(depositRecord?.amount, 12), [depositRecord?.amount]) // TODO: extract hardcoded decimal factor

    const { data: voteOption, isLoading: isVoteLoading } = useBridgeVoteQuery({
        amount,
        depositNonce,
        recipient: depositRecord?.destinationRecipientAddress,
        resourceId: depositRecord?.resourceID,
        srcChainId: originChainId,
    })

    const threshold = useBridgeVoteThresholdQuery()

    const voteStatus = useMemo(() => {
        if (voteOption === undefined || isVoteLoading) {
            return <>loading</>
        }

        if (voteOption.isEmpty) {
            return <>pending for proposal</>
        }

        const vote = voteOption.unwrapOr(undefined)

        return (
            <>
                {vote?.status.toString()} ({vote?.votes_for.length}
                {threshold && <>, {threshold} required</>})
            </>
        )
    }, [])

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
                {voteStatus}
            </p>

            <p>
                <i>updated {dayjs(dataUpdatedAt).fromNow()}</i>
            </p>
        </Block>
    )
}
