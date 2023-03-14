const PROXY_CONFIG = [
    {
        context: ['/'],
        target: 'http://localhost:5000/',
        secure: true,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: { '^/': '/' }
    }
];

module.exports = PROXY_CONFIG;
