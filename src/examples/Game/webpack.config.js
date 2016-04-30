module.exports = {
    entry: './src/examples/Game/index.ts',
    output: {
        filename: './dist/examples/Game/bundle.js'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
}
