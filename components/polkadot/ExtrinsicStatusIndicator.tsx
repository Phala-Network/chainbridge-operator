import { ExtrinsicStatus } from '@polkadot/types/interfaces'
import React from 'react'

export const ExtrinsicStatusIndicator = ({ status }: { status: ExtrinsicStatus }): JSX.Element => {
    if (status.isBroadcast) {
        return <>The transaction is being submitted to the network.</>
    }

    if (status.isInBlock) {
        return <>The transaction is being accepted by the network.</>
    }

    return <>The state of transaction is unknown.</>
}
