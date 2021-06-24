import { Client, Server } from 'styletron-engine-atomic'

export const HydrateClass = '_styletron_hydrate_'

const getHydrateClass = (): HTMLCollectionOf<HTMLStyleElement> => {
    return document.getElementsByClassName(HydrateClass) as HTMLCollectionOf<HTMLStyleElement>
}

export const styletron = typeof window === 'undefined' ? new Server() : new Client({ hydrate: getHydrateClass() })
