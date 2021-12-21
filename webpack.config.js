const path = require('path');

module.exports = {
    mode: "production",
    entry: "./src/index.ts",
    devtool: false,

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            },
            
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: [
                    'raw-loader'
                ]
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.js', '.json']
    },

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },

    devServer: {
        contentBase: path.join(__dirname, 'public'),
    }
}