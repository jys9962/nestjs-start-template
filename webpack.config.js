const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
    'class-transformer/storage',
    'vertx'
  ]

  return {
    ...options,
    externals: [],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true
          }
        })
      ]
    },
    output: {
      ...options.output,
      libraryTarget: 'commonjs2'
    },
    module: {
       rules: [
         {
           test: /\.ts$/ ,
           exclude: /(node_modules)/,
           use: {
               loader: "swc-loader"
           }
         }
       ]
     },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource)
            } catch (err) {
              return true
            }
          }
          return false
        }
      }),
      new CopyWebpackPlugin({
        patterns: [
          './node_modules/swagger-ui-dist/swagger-ui.css',
          './node_modules/swagger-ui-dist/swagger-ui-bundle.js',
          './node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js',
          './node_modules/swagger-ui-dist/favicon-16x16.png',
          './node_modules/swagger-ui-dist/favicon-32x32.png'
        ]
      })
    ]
  }
}