module.exports = {
    reactStrictMode: true,
    target: 'serverless',
    webpack: (config) => {
        config.externals = config.externals || {}
        config.externals['styletron-server'] = 'styletron-server'
        return config
    },
}
