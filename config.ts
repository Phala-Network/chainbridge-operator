interface NetworkConfiguration {
    bridge: string
    erc20: string
    erc20handler: string
}

export const networks: Record<number, NetworkConfiguration> = {
    42: {
        bridge: '0xb376b0ee6d8202721838e76376e81eec0e2fe864',
        erc20: '0x512f7a3c14b6ee86c2015bc8ac1fe97e657f75f2',
        erc20handler: '0x3634b5599ad150adb6a068e81c3e4cf1915bdc03',
    },
}
