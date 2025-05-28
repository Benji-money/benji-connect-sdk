import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/connect-sdk.js',
  output: {
    file: 'dist/connect-sdk.umd.js',
    format: 'umd',
    name: 'ConnectSDK', // window.ConnectSDK
  },
  plugins: [
    resolve(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env'],
      babelrc: false
    })
  ]
}; 