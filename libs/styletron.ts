import { Client, Server } from 'styletron-engine-atomic'

const getHydrateClass = (): HTMLStyleElement[] => {
    const elements = [...document.getElementsByClassName('_styletron_hydrate_')]
    return elements.filter((element) => element instanceof HTMLStyleElement) as HTMLStyleElement[]
}

export const styletron = typeof window === 'undefined' ? new Server() : new Client({ hydrate: getHydrateClass() })
