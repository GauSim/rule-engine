module.exports = {
    entry: './src/examples/Game/client.ts',
    output: {
        filename: './dist/examples/Game/bundle.js'
    },
    // Turn on sourcemaps
    // devtool: 'source-map',
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
}
