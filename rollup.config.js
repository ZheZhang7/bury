// 如果使用 import export  需要 babel ---> es
// node 环境使用 require module.exports
const path = require('path');
const ts = require('rollup-plugin-typescript');
const dts = require('rollup-plugin-dts').default;
module.exports = [
    {
        // 入口文件
        input: './src/core/index.ts',
        output: [
            {
                file: path.resolve(__dirname, './dist/index.esm.js'),
                // es --> esmodule import export
                // cjs --> require exports
                // umd --> AMD CMD global
                format: 'es'
            },
            {
                file: path.resolve(__dirname, './dist/index.cjs.js'),
                format: 'cjs'
            },
            {
                file: path.resolve(__dirname, './dist/index.js'),
                format: 'umd',
                name: 'bury'
            },
        ],
        plugins: [
            ts()
        ]
    }, 
    {
        // 打包声明文件
        input: './src/core/index.ts',
        output: [
            {
                file: path.resolve(__dirname, './dist/index.d.ts'),
                format: 'es'
            }
        ],
        plugins: [ dts() ]

    }
]