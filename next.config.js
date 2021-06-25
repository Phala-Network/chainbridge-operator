module.exports = {
    reactStrictMode: true,
    webpack: (config) => {
        config.externals = config.externals || {}
        config.externals['styletron-server'] = 'styletron-server'
        return config
    },
}
