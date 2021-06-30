import { ApiPromise } from '@polkadot/api'
import { AddressOrPair, SubmittableExtrinsic } from '@polkadot/api/types'
import { DispatchError, ExtrinsicStatus, Hash } from '@polkadot/types/interfaces'
import { ISubmittableResult, Signer } from '@polkadot/types/types'

interface SignAndSendProps {
    account: AddressOrPair
    api: ApiPromise
    extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>
    signer: Signer

    onstatus?: (status: ExtrinsicStatus) => void
}

class SimpleExtrinsicFailedError extends Error {
    constructor(error: string) {
        super(`Extrinsic Failed: ${error}`)
    }
}

class ExtrinsicFailedError extends SimpleExtrinsicFailedError {
    constructor(section: string, method: string, documentation: string[]) {
        super(`Extrinsic Failed: ${section}.${method}: ${documentation.join(' ')}`)
    }
}

class ExtrinsicSendError extends Error {}

export const waitSignAndSend = ({ account, api, extrinsic, onstatus, signer }: SignAndSendProps): Promise<Hash> => {
    const extrinsicResultPromise = new Promise<Hash>((resolve, reject) => {
        extrinsic
            .signAndSend(account, { signer }, ({ events, status }) => {
                if (status.isFinalized) {
                    const failures = events.filter(({ event }) => {
                        return api.events.system.ExtrinsicFailed.is(event)
                    })

                    const errors = failures.map(
                        ({
                            event: {
                                data: [error],
                            },
                        }) => {
                            if ((error as DispatchError)?.isModule?.valueOf()) {
                                // https://polkadot.js.org/docs/api/cookbook/tx#how-do-i-get-the-decoded-enum-for-an-extrinsicfailed-event
                                const decoded = api.registry.findMetaError((error as DispatchError).asModule)
                                const { documentation, method, section } = decoded

                                reject(new ExtrinsicFailedError(section, method, documentation))
                            } else {
                                reject(new SimpleExtrinsicFailedError(error?.toString() ?? toString.call(error)))
                            }
                        }
                    )

                    if (errors.length === 0) {
                        resolve(status.hash)
                    } else {
                        reject(errors)
                    }
                }

                onstatus?.(status)
            })
            .then((unsubscribe) => {
                extrinsicResultPromise.finally(() => unsubscribe())
            })
            .catch((reason) => {
                reject(new ExtrinsicSendError((reason as Error)?.message ?? reason))
            })
    })

    return extrinsicResultPromise
}
